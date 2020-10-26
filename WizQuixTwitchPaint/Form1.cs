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
using WizQuixTwitchPaint.Model;
using WizQuixTwitchPaint.Util;
using WizQuixTwitchPaint.View;

/*
 #1;Red=3355647;Light Red=10066431;Dark Red=153;Orange=3381759;Light Orange=10079487;Dark Orange=19609;Yellow=3407871;Light Yellow=10092543;Dark Yellow=39321;Lime=3407769;Light Lime=10092492;Dark Lime=39244;Green=3407667;Light Green=10092441;Dark Green=39168;Aqua=10092339;Light Aqua=13434777;Dark Aqua=5019904;Cyan=16777011;Light Cyan=16777113;Dark Cyan=10066176;

#2;Blue=16750899;Light Blue=16764057;Dark Blue=10046464;Indigo=16724787;Light Indigo=16751001;Dark Indigo=10027008;Violet=16724889;Light Violet=16751052;Dark Violet=10027084;Pink=16724991;Light Pink=16751103;Dark Pink=10027161;Ruby=10040319;Light Ruby=13408767;Dark Ruby=4980889;White=16777215;Light Grey=14737632;Grey=8421504;Dark Grey=4210752;Light Black=2105376;Black=0;
 */

namespace WizQuixTwitchPaint
{
    public partial class Form1 : Form
    {
        private const int _canvasWidth = 16;
        private const int _canvasHeight = 16;

        private Canvas _canvas;
        private Colors _colors;

        private CanvasPanel _canvasPanel;
        private ColorsPanel _colorsPanel;

        private Twitch _twitch;

        public Form1()
        {
            InitializeComponent();

            this._colors = new Colors();
            this._canvas = new Canvas(this._colors, _canvasWidth, _canvasHeight);

            this._colorsPanel = new ColorsPanel(this._colors);
            this._canvasPanel = new CanvasPanel(this._canvas);

            this._twitch = new Twitch(this._canvas, this._colors);

            this.MainContainer.Panel1.Controls.Add(this._canvasPanel);
            this.ControlSplitter.Panel2.Controls.Add(this._colorsPanel);

            this.ConnectButton.Select();
            this.MinimumSize = new Size(800, 600);

            this.ConnectButton.Click += ConnectButton_Click;
            this.ImageSelectionButton.Click += ImageSelectionButton_Click;
            this.MessagedPeriodTextbox.TextChanged += MessagedPeriodTextbox_TextChanged;

            this.LoadJson();
        }

        private void ConnectButton_Click(object sender, EventArgs e)
        {
            try
            {
                if(!this._twitch.IsConnected)
                {
                    var res = this._twitch.Connect(UsernameTextbox.Text, AccessTokenTextbox.Text, ChannelTextbox.Text, ()=>
                    {
                        MethodInvoker d = delegate ()
                        {
                            ConnectButton.Text = "Disconnect";
                            ConnectButton.Enabled = true;
                            this.SaveJson();
                        };
                        this.Invoke(d);
                    }, (string error)=>
                    {
                        MethodInvoker d = delegate ()
                        {
                            ConnectButton.Text = "Connect";
                            ConnectButton.Enabled = true;

                            MessageBox.Show($"Failed to connect\n{error}", "Error");
                        };
                        this.Invoke(d);
                    });
                    if(res)
                    {
                        ConnectButton.Text = "Connecting...";
                        ConnectButton.Enabled = false;
                    }
                }
                else
                {
                    _twitch.Disconnect();
                    ConnectButton.Text = "Connect";
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error");
            }
        }

        private void MessagedPeriodTextbox_TextChanged(object sender, EventArgs e)
        {
            if(int.TryParse(MessagedPeriodTextbox.Text, out var period))
            {
                this._twitch.Delay = period;
            }
        }

        private void ImageSelectionButton_Click(object sender, EventArgs e)
        {
            var ofd = new OpenFileDialog();
            var res = ofd.ShowDialog();
            if (res == DialogResult.OK)
            {
                try
                {
                    string file = ofd.FileName;
                    var img = Image.FromFile(file);

                    this._canvas.ParseImage(img);

                    img.Dispose();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error");
                }
            }
        }

        private void LoadJson()
        {
            if (File.Exists("settings.json"))
            {
                string json = File.ReadAllText("settings.json");
                dynamic settings = JsonConvert.DeserializeObject(json);
                UsernameTextbox.Text = settings.username;
                AccessTokenTextbox.Text = settings.accesstoken;
                ChannelTextbox.Text = settings.channel;
                MessagedPeriodTextbox.Text = settings.messagesperiod;
            }
        }

        private void SaveJson()
        {
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
    }
}
