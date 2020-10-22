/**
 * I'm making some changes to check is it workig :)
 */

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.VisualStyles;
using TwitchLib.Client;
using TwitchLib.Client.Models;
using TwitchLib.Communication.Clients;
using TwitchLib.Communication.Models;

namespace WizQuixTwitchPaint
{
    public partial class Form1 : Form
    {
        private const int _padding = 32;
        private const int _gridWidth = 16;
        private const int _gridHeight = 16;

        private readonly Pen _goldPen = new Pen(Color.Gold) { Width = 3 };

        private static readonly List<(string name, Color color)> _colors = new List<(string name, Color color)>
        {
            ( "Red",            ColorTranslator.FromHtml("#FF3333") ),
            ( "Light Red",      ColorTranslator.FromHtml("#FF9999") ),
            ( "Dark Red",       ColorTranslator.FromHtml("#990000") ),
            ( "Orange",         ColorTranslator.FromHtml("#FF9933") ),
            ( "Light Orange",   ColorTranslator.FromHtml("#FFCC99") ),
            ( "Dark Orange",    ColorTranslator.FromHtml("#994C00") ),
            ( "Yellow",         ColorTranslator.FromHtml("#FFFF33") ),
            ( "Light Yellow",   ColorTranslator.FromHtml("#FFFF99") ),
            ( "Dark Yellow",    ColorTranslator.FromHtml("#999900") ),
            ( "Lime",           ColorTranslator.FromHtml("#99FF33") ),
            ( "Light Lime",     ColorTranslator.FromHtml("#CCFF99") ),
            ( "Dark Lime",      ColorTranslator.FromHtml("#4C9900") ),
            ( "Green",          ColorTranslator.FromHtml("#33FF33") ),
            ( "Light Green",    ColorTranslator.FromHtml("#99FF99") ),
            ( "Dark Green",     ColorTranslator.FromHtml("#009900") ),
            ( "Aqua",           ColorTranslator.FromHtml("#33FF99") ),
            ( "Light Aqua",     ColorTranslator.FromHtml("#99FFCC") ),
            ( "Dark Aqua",      ColorTranslator.FromHtml("#00994C") ),
            ( "Cyan",           ColorTranslator.FromHtml("#33FFFF") ),
            ( "Light Cyan",     ColorTranslator.FromHtml("#99FFFF") ),
            ( "Dark Cyan",      ColorTranslator.FromHtml("#009999") ),
            ( "Blue",           ColorTranslator.FromHtml("#3399FF") ),
            ( "Light Blue",     ColorTranslator.FromHtml("#99CCFF") ),
            ( "Dark Blue",      ColorTranslator.FromHtml("#004C99") ),
            ( "Indigo",         ColorTranslator.FromHtml("#3333FF") ),
            ( "Light Indigo",   ColorTranslator.FromHtml("#9999FF") ),
            ( "Dark Indigo",    ColorTranslator.FromHtml("#000099") ),
            ( "Violet",         ColorTranslator.FromHtml("#9933FF") ),
            ( "Light Violet",   ColorTranslator.FromHtml("#CC99FF") ),
            ( "Dark Violet",    ColorTranslator.FromHtml("#4C0099") ),
            ( "Pink",           ColorTranslator.FromHtml("#FF33FF") ),
            ( "Light Pink",     ColorTranslator.FromHtml("#FF99FF") ),
            ( "Dark Pink",      ColorTranslator.FromHtml("#990099") ),
            ( "Ruby",           ColorTranslator.FromHtml("#FF3399") ),
            ( "Light Ruby",     ColorTranslator.FromHtml("#FF99CC") ),
            ( "Dark Ruby",      ColorTranslator.FromHtml("#99004C") ),
            ( "White",          ColorTranslator.FromHtml("#FFFFFF") ),
            ( "Light Grey",     ColorTranslator.FromHtml("#E0E0E0") ),
            ( "Grey",           ColorTranslator.FromHtml("#808080") ),
            ( "Dark Grey",      ColorTranslator.FromHtml("#404040") ),
            ( "Light Black",    ColorTranslator.FromHtml("#202020") ),
            ( "Black",          ColorTranslator.FromHtml("#000000") )
        };

        private static Dictionary<string, Pen> _pens;
        private static Dictionary<string, SolidBrush> _brushes;

        private static readonly string[] _verticalIdentifiers = new string[]
            { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16" };
        private static readonly string[] _horizontalIdentifiers = new string[]
            { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P" };
        private static readonly StringFormat _stringFormat = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

        private bool _isMouseDown = false;
        private float _mouseX = 0f;
        private float _mouseY = 0f;

        private TwitchClient _twitchClient = null;
        private List<string> _twitchQueue = new List<string>();

        private int _selectedColor = 0;
        private int SelectedColor
        {
            get => _selectedColor;
            set
            {
                _selectedColor = value;
                if (_selectedColor < 0 || _selectedColor >= _colors.Count) _selectedColor = 0;
            }
        }

        private int[,] _canvas;

        static Form1()
        {
            _pens = new Dictionary<string, Pen>();
            _brushes = new Dictionary<string, SolidBrush>();
            foreach(var color in _colors)
            {
                _pens.Add(color.name, new Pen(color.color));
                _brushes.Add(color.name, new SolidBrush(color.color));
            }
        }

        public Form1()
        {
            InitializeComponent();

            typeof(SplitContainer).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.MainContainer, new object[] { true });

            typeof(Panel).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.MainContainer.Panel1, new object[] { true });

            typeof(Panel).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.MainContainer.Panel2, new object[] { true });

            typeof(SplitContainer).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.ControlSplitter, new object[] { true });

            typeof(Panel).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.ControlSplitter.Panel1, new object[] { true });

            typeof(Panel).InvokeMember("DoubleBuffered", BindingFlags.SetProperty
               | BindingFlags.Instance | BindingFlags.NonPublic, null,
               this.ControlSplitter.Panel2, new object[] { true });

            this.ConnectButton.Select();
            this.MinimumSize = new Size(800, 600);

            _canvas = new int[_gridWidth, _gridHeight];
            for(int iy = 0; iy < _gridHeight; iy++)
            {
                for(int ix = 0; ix < _gridWidth; ix++)
                {
                    _canvas[ix, iy] = 40;
                }
            }

            if(File.Exists("settings.json"))
            {
                string json = File.ReadAllText("settings.json");
                dynamic settings = JsonConvert.DeserializeObject(json);
                UsernameTextbox.Text = settings.username;
                AccessTokenTextbox.Text = settings.accesstoken;
                ChannelTextbox.Text = settings.channel;
                MessagedPeriodTextbox.Text = settings.messagesperiod;
            }
        }

        private void splitContainer1_Panel1_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.Clear(Color.Black);

            float width = e.ClipRectangle.Width;
            float height = e.ClipRectangle.Height;

            float x1 = GetX1();
            float y1 = GetY1();
            float x2 = GetX2(width, height);
            float y2 = GetY2(width, height);

            float w = ((x2 - x1) / _gridWidth);
            float h = ((y2 - y1) / _gridHeight);

            var mousePoint = GetPoint(_mouseX, _mouseY, width, height);
            var mouseRect = GetRect(mousePoint.x, mousePoint.y, width, height);

            if (_isMouseDown)
            {
                SetPoint(mousePoint.x, mousePoint.y);
            }

            for (int iy = 0; iy < _gridHeight; iy++)
            {
                for(int ix = 0; ix < _gridWidth; ix++)
                {
                    float x = x1 + ix * w;
                    float y = y1 + iy * h;

                    g.FillRectangle(GetBrush(_canvas[ix,iy]), x, y, w, h);
                }
            }

            for(int i = 0; i < _verticalIdentifiers.Length; i++)
            {
                float y = y1 + i * h + h / 2;
                g.DrawString(_verticalIdentifiers[i], Font, Brushes.White, x1 / 2, y, _stringFormat);
            }
            float strY = y2 + _padding/2;
            for (int i = 0; i < _horizontalIdentifiers.Length; i++)
            {
                float x = x1 + i * w + w / 2;
                g.DrawString(_horizontalIdentifiers[i], Font, Brushes.White, x, strY, _stringFormat);
            }

            g.DrawRectangle(Pens.White, x1, y1, x2 - x1, y2 - y1);

            g.FillRectangle(GetBrush(), mouseRect.x1, mouseRect.y1, mouseRect.x2 - mouseRect.x1, mouseRect.y2 - mouseRect.y1);
            g.DrawRectangle(_goldPen, mouseRect.x1, mouseRect.y1, mouseRect.x2 - mouseRect.x1, mouseRect.y2 - mouseRect.y1);
        }

        private void splitContainer1_Panel2_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.Clear(Color.Black);

            float width = e.ClipRectangle.Width;
            float height = e.ClipRectangle.Height;

            float x1 = GetX1();
            float y1 = GetY1();
            float x2 = GetX2(width, height);
            float y2 = GetY2(width, height);

            float w = x2 - x1;
            float h = y2 - y1;

            int sqrt = (int)Math.Sqrt(_colors.Count);

            float wh = Math.Min(w,h) / sqrt;

            for(int i = 0; i < _colors.Count; i++)
            {
                int ix = i % sqrt;
                int iy = i / sqrt;

                float x = x1 + wh * ix + 1;
                float y = y1 + wh * iy + 1;
                g.FillRectangle(new SolidBrush(_colors[i].color), x, y, wh - 2, wh - 2);

                if(SelectedColor == i)
                {
                    g.DrawRectangle(_goldPen, x, y, wh - 2, wh - 2);
                }
            }
        }

        private void MainContainer_Panel1_MouseDown(object sender, MouseEventArgs e)
        {
            _isMouseDown = true;
        }

        private void MainContainer_Panel1_MouseUp(object sender, MouseEventArgs e)
        {
            _isMouseDown = false;
        }

        private void MainContainer_Panel1_MouseMove(object sender, MouseEventArgs e)
        {
            _mouseX = e.X;
            _mouseY = e.Y;
        }

        private void ControlSplitter_Panel2_MouseClick(object sender, MouseEventArgs e)
        {
            float width = ControlSplitter.Panel2.Width;
            float height = ControlSplitter.Panel2.Height;

            float x1 = GetX1();
            float y1 = GetY1();
            float x2 = GetX2(width, height);
            float y2 = GetY2(width, height);

            float w = x2 - x1;
            float h = y2 - y1;

            int sqrt = (int)Math.Sqrt(_colors.Count);

            float wh = Math.Min(w, h) / sqrt;

            float mx = e.X - x1;
            float my = e.Y - y1;

            int cx = (int)(mx / wh);
            int cy = (int)(my / wh);

            int index = cy * sqrt + cx;
            SelectedColor = index;
        }

        private (int x, int y) GetPoint(float px, float py, float width, float height)
        {
            float x1 = GetX1();
            float y1 = GetY1();
            float x2 = GetX2(width, height);
            float y2 = GetY2(width, height);

            if (px < x1 || px > x2 || py < y1 || py > y2) return (-1, -1);

            float rx = px - x1;
            float ry = py - y1;

            float w = x2 - x1;
            float h = y2 - y1;

            float nx = rx / w;
            float ny = ry / h;

            return ((int)(nx * _gridWidth), (int)(ny * _gridHeight));
        }

        private (float x1, float y1, float x2, float y2) GetRect(int px, int py, float width, float height)
        {
            if (px < 0 || px >= _gridWidth || py < 0 || py >= _gridHeight) return (-1, -1, -1, -1);

            float x = GetX1();
            float y = GetY1();
            float w = (GetX2(width, height) - x) / _gridWidth;
            float h = (GetY2(width, height) - y) / _gridHeight;

            float x1 = x + w * px;
            float y1 = y + h * py;
            float x2 = x1 + w;
            float y2 = y1 + h;
            return (x1, y1, x2, y2);
        }

        private void SetPoint(int x, int y, int index = -1)
        {
            if (index < 0) index = SelectedColor;

            if(x >= 0 && x < _gridWidth && y >= 0 && y < _gridHeight)
            {
                if (_canvas[x, y] == index) return;
                _canvas[x, y] = index;
                _twitchQueue.Add($"!paint {_horizontalIdentifiers[x]}{_verticalIdentifiers[y]} {_colors[index].name}");
            }
        }

        private float GetX1()
        {
            return _padding;
        }

        private float GetX2(float width, float height)
        {
            var min = Math.Min(width - _padding * 2, height - _padding * 2);
            return GetX1() + min;
        }

        private float GetY1()
        {
            return _padding;
        }

        private float GetY2(float width, float height)
        {
            var min = Math.Min(width - _padding * 2, height - _padding * 2);
            return GetY1() + min;
        }

        private Pen GetPen(int index = -1)
        {
            if (index < 0) index = SelectedColor;
            return _pens[_colors[index].name];
        }

        private SolidBrush GetBrush(int index = -1)
        {
            if (index < 0) index = SelectedColor;
            return _brushes[_colors[index].name];
        }

        private int GetClosestColorIndex(Color color)
        {
            var closest = _colors.OrderBy(c=>ColorDiff(c.color, color)).First();
            return _colors.IndexOf(closest);
        }

        private int ColorDiff(Color c1, Color c2)
        {
            return (int)Math.Sqrt((c1.R - c2.R) * (c1.R - c2.R)
                                   + (c1.G - c2.G) * (c1.G - c2.G)
                                   + (c1.B - c2.B) * (c1.B - c2.B));
        }

        private void TickTimer_Tick(object sender, EventArgs e)
        {
            this.MainContainer.Panel1.Refresh();

            this.ControlSplitter.Panel2.Refresh();
        }

        private void ConnectButton_Click(object sender, EventArgs e)
        {
            if(_twitchClient == null || !_twitchClient.IsConnected)
            {
                try
                {
                    ConnectionCredentials credentials = new ConnectionCredentials(UsernameTextbox.Text, AccessTokenTextbox.Text);
                    var socketClient = new WebSocketClient();
                    _twitchClient = new TwitchClient(socketClient);
                    _twitchClient.Initialize(credentials, ChannelTextbox.Text);

                    _twitchClient.Connect();

                    ConnectButton.Text = "Disconnect";

                    int period = 5000;
                    if (int.TryParse(MessagedPeriodTextbox.Text, out period))
                    {
                        TwitchTimer.Interval = period;
                        TwitchTimer.Enabled = true;
                    }

                    Dictionary<string, string> settings = new Dictionary<string, string>()
                    {
                        { "username", UsernameTextbox.Text },
                        { "accesstoken", AccessTokenTextbox.Text },
                        { "channel", ChannelTextbox.Text },
                        { "messagesperiod", MessagedPeriodTextbox.Text }
                    };
                    string json = JsonConvert.SerializeObject(settings);
                    File.WriteAllText("settings.json", json);
                }
                catch(Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error");
                }
            }
            else
            {
                _twitchClient.Disconnect();
                _twitchClient = null;

                ConnectButton.Text = "Connect";
            }
        }

        private void ImageSelectionButton_Click(object sender, EventArgs e)
        {
            var ofd = new OpenFileDialog();
            var res = ofd.ShowDialog();
            if(res == DialogResult.OK)
            {
                try
                {
                    string file = ofd.FileName;
                    var img = Image.FromFile(file);
                    var btm = new Bitmap(img);

                    int stepX = btm.Width / _gridWidth;
                    int stepY = btm.Height / _gridHeight;

                    for(int iy = 0; iy < _gridHeight; iy++)
                    {
                        for(int ix = 0; ix < _gridWidth; ix++)
                        {
                            var color = btm.GetPixel(ix*stepX, iy*stepY);
                            int index = GetClosestColorIndex(color);
                            SetPoint(ix, iy, index);
                        }
                    }

                    img.Dispose();
                }
                catch(Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error");
                }
            }
        }

        private void TwitchTimer_Tick(object sender, EventArgs e)
        {
            if (_twitchClient == null) return;
            if (!_twitchClient.IsConnected) return;

            if (_twitchQueue.Count == 0) return;

            _twitchClient.SendMessage(ChannelTextbox.Text, _twitchQueue[0]);
            _twitchQueue.RemoveAt(0);
        }
    }
}
