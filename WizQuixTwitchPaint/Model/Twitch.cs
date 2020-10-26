using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TwitchLib.Client;
using TwitchLib.Client.Models;
using TwitchLib.Communication.Clients;

namespace WizQuixTwitchPaint.Model
{
    public class Twitch
    {
        private const int _minDelay = 750;

        public bool IsConnected { get; private set; }

        private int _delay = _minDelay;
        public int Delay
        {
            get => this._delay;
            set
            {
                _delay = Math.Max(_minDelay, value);
                _timer.Interval = _delay;
            }
        }

        private TwitchClient _client;

        private string _username;
        private string _token;
        private string _channel;
        private Action _onconnect = null;
        private Action<string> _onfailed = null;
        private Timer _timer;

        private int _lastColorId = 0;

        private Canvas _canvas;
        private Colors _colors;

        public Twitch(Canvas canvas, Colors colors)
        {
            this._canvas = canvas;
            this._colors = colors;

            _timer = new Timer();
            _timer.Enabled = true;
            _timer.Interval = Delay;
            _timer.Tick += _timer_Tick;
            _timer.Start();
        }

        public bool Connect(string username, string token, string channel, Action onconnect = null, Action<string> onfailed = null)
        {
            if (IsConnected)
            {
                this.Disconnect();
                return false;
            }

            this._username = username;
            this._token = token;
            this._channel = channel;

            ConnectionCredentials credentials = new ConnectionCredentials(this._username, this._token);

            var socketClient = new WebSocketClient();
            _client = new TwitchClient(socketClient);
            _client.OnConnected += _client_OnConnected;
            _client.OnDisconnected += _client_OnDisconnected;
            _client.OnConnectionError += _client_OnConnectionError;
            _client.OnError += _client_OnError;
            _client.OnFailureToReceiveJoinConfirmation += _client_OnFailureToReceiveJoinConfirmation;
            _client.OnMessageReceived += _client_OnMessageReceived;
            _client.Initialize(credentials, this._channel);
            _client.Connect();

            this._onconnect = onconnect;
            this._onfailed = onfailed;

            _lastColorId = 0;

            return true;
        }

        private void _timer_Tick(object sender, EventArgs e)
        {
            if (!IsConnected) return;
            if (this._canvas.History.Count == 0) return;

            var item = this._canvas.History.First();
            this._canvas.History.RemoveAt(0);

            string horizontal = this._canvas.HorizontalCoords[item.X];
            string vertical = this._canvas.VerticalCoords[item.Y];
            string command = $"!paint {horizontal}{vertical} {item.Color.Name}";

            this._client.SendMessage(this._channel, command);
        }

        private void _client_OnMessageReceived(object sender, TwitchLib.Client.Events.OnMessageReceivedArgs e)
        {
            int index = e.ChatMessage.Message.IndexOf(';');
            if (index < 0) return;
            string header = e.ChatMessage.Message.Substring(0, index+1);
            if (!header.StartsWith("#")) return;
            if (!header.EndsWith(";")) return;
            string messageId = header.Substring(1, header.Length - 2);
            if (!int.TryParse(messageId, out var id)) return;
            if (id != _lastColorId + 1) return;

            _lastColorId = id;
            string colors = e.ChatMessage.Message.Substring(index+1);
            this._colors.ParseColors(colors);
        }

        private void _client_OnFailureToReceiveJoinConfirmation(object sender, TwitchLib.Client.Events.OnFailureToReceiveJoinConfirmationArgs e)
        {
            this._onfailed?.Invoke(e.Exception.Details);
        }

        private void _client_OnError(object sender, TwitchLib.Communication.Events.OnErrorEventArgs e)
        {
            this._onfailed?.Invoke(e.Exception.Message);
        }

        private void _client_OnConnectionError(object sender, TwitchLib.Client.Events.OnConnectionErrorArgs e)
        {
            this._onfailed?.Invoke(e.Error.Message);
        }

        public void Disconnect()
        {
            if (!IsConnected) return;

            this._client.LeaveChannel(this._channel);
            this._client.Disconnect();
            this._client = null;
        }

        private void _client_OnDisconnected(object sender, TwitchLib.Communication.Events.OnDisconnectedEventArgs e)
        {
            IsConnected = false;
        }

        private void _client_OnConnected(object sender, TwitchLib.Client.Events.OnConnectedArgs e)
        {
            IsConnected = true;
            this._client.SendMessage(this._channel, "!colorcodes");
            this._colors.Clear();

            this._onconnect?.Invoke();
        }
    }
}
