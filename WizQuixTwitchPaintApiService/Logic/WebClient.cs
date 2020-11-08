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

        public void Init()
        {
            _commands.Add(new SetPixelCommand(this));
            _commands.Add(new GetColorsCommand(this));
            _commands.Add(new GetBackgroundCommand(this));
            _commands.Add(new GetCanvasCommand(this));
            _commands.Add(new GetTitleCommand(this));

            if (IsBroadcaster)
            {
                _commands.Add(new SetColorsCommand(this));
                _commands.Add(new SetColorCommand(this));
                _commands.Add(new ClearPaletteCommand(this));
                _commands.Add(new SetBackgroundCommand(this));
                _commands.Add(new SetCanvasCommand(this));
                _commands.Add(new SetTitleCommand(this));
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
                    }

                    _rawCommands.RemoveAt(0);
                }
            }
        }

        //setme <{broadcaster|viewer}> <{channelid:int|channelname:string}> [<{userid:int|username:string}>]
        public async Task Identify()
        {
            string packet = await ReadPacket();
            string command = packet.ToLower();

            int indexOfNull = command.IndexOf("\0");
            if (indexOfNull >= 0) command = command.Substring(0, indexOfNull);

            string[] split = command.Split(' ');

            if (split.Length < 3) return;
            if (split[0] != "setme") return;

            if (int.TryParse(split[2], out var channelId))
                Channel = await GetUser(channelId);
            else
                Channel = await GetUser(split[2]);

            if (split[1] == "broadcaster")
            {
                IsBroadcaster = true;
                IsIdentified = true;
            }
            else if (split[1] == "viewer")
            {
                if (split.Length < 4) return;

                if (int.TryParse(split[3], out var userId))
                    User = await GetUser(userId);
                else
                    User = await GetUser(split[3]);

                IsBroadcaster = false;
                IsIdentified = true;

            }
            else return;
        }

        private async Task ReadCommands()
        {
            string packet = await ReadPacket();
            var split = packet.Split('\0').Where(c=>!string.IsNullOrWhiteSpace(c));
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
            if (!message.EndsWith("\0")) message = $"{message}\0";
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
    }
}
