using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WizQuixTwitchPaintApiService.Logic.Commands;
using WizQuixTwitchPaintApiService.Models;

namespace WizQuixTwitchPaintApiService.Logic
{
    public class WebClient
    {
        public bool IsIdentified { get; private set; } = false;
        public bool IsBroadcaster { get; private set; } = false;
        public bool IsConnected { get; private set; }

        public TwitchUser Channel { get; private set; }
        public TwitchUser User { get; private set; }
        
        private WebSocket _socket = null;
        private byte[] _buffer = new byte[1024*4];
        private List<string> _rawCommands = new List<string>();
        private List<ACommand> _commands = new List<ACommand>();

        public Room JoinedRoom { get; set; }

        public delegate void ConnectionClosed(WebClient client);
        public event ConnectionClosed OnConnectionClose;

        public WebClient(WebSocket socket)
        {
            this._socket = socket;
            this.IsConnected = true;
        }

        public void InitIdentification()
        {
            _commands.Add(new CreateRoomCommand(this));
            _commands.Add(new JoinRoomCommand(this));
        }

        public void InitCommands()
        {
            _commands.Clear();

            _commands.Add(new SetPixelCommand(this));
            _commands.Add(new GetColorsCommand(this));
            _commands.Add(new GetBackgroundCommand(this));
            _commands.Add(new GetCanvasCommand(this));
            _commands.Add(new GetTitleCommand(this));
            _commands.Add(new GetIntervalCommand(this));

            if (IsBroadcaster)
            {
                _commands.Add(new SetColorsCommand(this));
                _commands.Add(new SetColorCommand(this));
                _commands.Add(new ClearPaletteCommand(this));
                _commands.Add(new SetBackgroundCommand(this));
                _commands.Add(new SetCanvasCommand(this));
                _commands.Add(new SetTitleCommand(this));
                _commands.Add(new SetIntervalCommand(this));
            }
        }

        public async Task Run()
        {
            while (IsConnected)
            {
                await ReadCommands();
                
                while(_rawCommands.Count > 0)
                {
                    string commandText = _rawCommands[0];

                    string[] parts = commandText.Split(' ');
                    if(parts.Length > 0)
                    {
                        var command = _commands.FirstOrDefault(c=>c.Name.ToLower() == parts[0].ToLower());
                        if(command != null)
                        {
                            await command.Execute(parts.Skip(1).ToArray());
                        }
                        else
                        {
                            await SendError(parts[0].ToLower(), HttpCodes.Code404, $"Command '{parts[0].ToLower()}' didn't exists");
                        }
                    }

                    _rawCommands.RemoveAt(0);
                }
            }
        }

        public async Task SetChannel(string nickname)
        {
            var twitchUser = await GetUser(nickname);
            Channel = twitchUser;
        }

        public async Task SetChannel(int userid)
        {
            var twitchUser = await GetUser(userid);
            Channel = twitchUser;
        }

        public async Task SetUser(string nickname)
        {
            var twitchUser = await GetUser(nickname);
            User = twitchUser;
        }

        public async Task SetUser(int userid)
        {
            var twitchUser = await GetUser(userid);
            User = twitchUser;
        }

        public void Identify(bool isBroadcaster)
        {
            IsBroadcaster = isBroadcaster;
            IsIdentified = true;
        }

        public bool CheckConnection()
        {
            return _socket.State == WebSocketState.Open;
        }

        private async Task ReadCommands()
        {
            string packet = await ReadPacket();
            var split = packet.Split('\n').Where(c=>!string.IsNullOrWhiteSpace(c));
            _rawCommands.AddRange(split);
        }

        private async Task<string> ReadPacket()
        {
            string packet = "";
            WebSocketReceiveResult result = await _socket.ReceiveAsync(new ArraySegment<byte>(_buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string part = Encoding.UTF8.GetString(_buffer, 0, result.Count);
                    packet += part;
                }

                if (!result.EndOfMessage) result = await _socket.ReceiveAsync(new ArraySegment<byte>(_buffer), CancellationToken.None);
                else break;
            }

            if(result.CloseStatus.HasValue)
            {
                IsConnected = false;
                OnConnectionClose?.Invoke(this);
            }

            return packet;
        }

        public async Task SendMessage(string message)
        {
            if (!message.EndsWith("\n")) message = $"{message}\n";
            var bytes = Encoding.UTF8.GetBytes(message);
            await _socket.SendAsync(new ArraySegment<byte>(bytes, 0, bytes.Length), WebSocketMessageType.Text, true, CancellationToken.None);
        }

        public async Task Close()
        {
            await _socket.CloseAsync(WebSocketCloseStatus.Empty, null, CancellationToken.None);
            IsConnected = false;
            OnConnectionClose?.Invoke(this);
        }

        private async Task<TwitchUser> GetUser(string username)
        {
            return await GetUser("login", username);
        }
        private async Task<TwitchUser> GetUser(int id)
        {
            return await GetUser("id", id.ToString());
        }

        private async Task<TwitchUser> GetUser(string k, string v)
        {
            var snakeSettings = new JsonSerializerSettings
            {
                ContractResolver  = new DefaultContractResolver
                {
                    NamingStrategy = new SnakeCaseNamingStrategy()
                }
            };

            var token = await Hub.GetToken();
            TwitchUser ret = null;

            using (var http = new HttpClient())
            {
                http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                http.DefaultRequestHeaders.Add("Client-ID", Hub.TwitchClientId);

                var res = await http.GetAsync($"{Hub.TWITCH_API_URI}users?{k}={v}");
                string json = await res.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, List<TwitchUser>>>(json, snakeSettings);
                ret = data["data"].FirstOrDefault();
            }

            return ret;
        }

        public async Task SendInfo(string command, string text = "OK")
        {
            await SendMessage($"info {command} {text}\n");
        }

        public async Task SendError(string command, HttpCodes code, string text)
        {
            await SendError(command, (int)code, string.IsNullOrWhiteSpace(text) ? ErrorTexts[code] : text);
        }

        public async Task SendError(string command, int code, string text)
        {
            await SendMessage($"error {command} {code} {text}\n");
        }

        private static Dictionary<HttpCodes, string> ErrorTexts = new Dictionary<HttpCodes, string>
        {
            { HttpCodes.Code400, "Bad Request" },
            { HttpCodes.Code401, "Unauthorized" },
            { HttpCodes.Code404, "Not Found" },
            { HttpCodes.Code409, "Conflict" },
            { HttpCodes.Code500, "Internal Server Error" }
        };

        public enum HttpCodes
        {
            Code200 = 200,
            Code400 = 400,
            Code401 = 401,
            Code404 = 404,
            Code409 = 409,
            Code500 = 500
        }
    }
}
