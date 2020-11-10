using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using WizQuixTwitchPaintApiService.Models;

namespace WizQuixTwitchPaintApiService.Logic
{
    public class Room
    {
        private const string _letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public const int Width = 16;
        public const int Height = 16;
        public List<string> VerticalCoords { get; private set; }
        public List<string> HorizontalCoords { get; private set; }

        public string Name { get; private set; }

        public int Interval { get; private set; } = 2500;
        private Timer _timer;
        private ConcurrentQueue<HistoryItem> _history = new ConcurrentQueue<HistoryItem>();
        
        public WebClient Broadcaster { get; private set; }
        public ConcurrentDictionary<int, WebClient> Viewers { get; private set; } = new ConcurrentDictionary<int, WebClient>();

        public string Background { get; private set; } = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=";
        public string Title { get; private set; } = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=";

        public List<MyColor> Colors = new List<MyColor>
        {
            new MyColor( "Red",            "#FF3333" ),
            new MyColor( "Light Red",      "#FF9999" ),
            new MyColor( "Dark Red",       "#990000" ),
            new MyColor( "Orange",         "#FF9933" ),
            new MyColor( "Light Orange",   "#FFCC99" ),
            new MyColor( "Dark Orange",    "#994C00" ),
            new MyColor( "Yellow",         "#FFFF33" ),
            new MyColor( "Light Yellow",   "#FFFF99" ),
            new MyColor( "Dark Yellow",    "#999900" ),
            new MyColor( "Lime",           "#99FF33" ),
            new MyColor( "Light Lime",     "#CCFF99" ),
            new MyColor( "Dark Lime",      "#4C9900" ),
            new MyColor( "Green",          "#33FF33" ),
            new MyColor( "Light Green",    "#99FF99" ),
            new MyColor( "Dark Green",     "#009900" ),
            new MyColor( "Aqua",           "#33FF99" ),
            new MyColor( "Light Aqua",     "#99FFCC" ),
            new MyColor( "Dark Aqua",      "#00994C" ),
            new MyColor( "Cyan",           "#33FFFF" ),
            new MyColor( "Light Cyan",     "#99FFFF" ),
            new MyColor( "Dark Cyan",      "#009999" ),
            new MyColor( "Blue",           "#3399FF" ),
            new MyColor( "Light Blue",     "#99CCFF" ),
            new MyColor( "Dark Blue",      "#004C99" ),
            new MyColor( "Indigo",         "#3333FF" ),
            new MyColor( "Light Indigo",   "#9999FF" ),
            new MyColor( "Dark Indigo",    "#000099" ),
            new MyColor( "Violet",         "#9933FF" ),
            new MyColor( "Light Violet",   "#CC99FF" ),
            new MyColor( "Dark Violet",    "#4C0099" ),
            new MyColor( "Pink",           "#FF33FF" ),
            new MyColor( "Light Pink",     "#FF99FF" ),
            new MyColor( "Dark Pink",      "#990099" ),
            new MyColor( "Ruby",           "#FF3399" ),
            new MyColor( "Light Ruby",     "#FF99CC" ),
            new MyColor( "Dark Ruby",      "#99004C" ),
            new MyColor( "White",          "#FFFFFF" ),
            new MyColor( "Light Grey",     "#E0E0E0" ),
            new MyColor( "Grey",           "#808080" ),
            new MyColor( "Dark Grey",      "#404040" ),
            new MyColor( "Light Black",    "#202020" ),
            new MyColor( "Black",          "#000000" )
        };
        public MyColor[,] Canvas = new MyColor[Width, Height];

        public Room(WebClient broadcaster)
        {
            Broadcaster = broadcaster;
            Name = broadcaster.Channel.Login;

            this.VerticalCoords = Enumerable.Range(1, Width).Select(n => $"{n}").ToList();
            this.HorizontalCoords = Enumerable.Range(0, Height).Select(n => $"{_letters[n % _letters.Length]}").ToList();

            for (int iy = 0; iy < Room.Height; iy++)
            {
                for (int ix = 0; ix < Room.Width; ix++)
                {
                    Canvas[ix, iy] = Colors[Colors.Count - 2];
                }
            }

            broadcaster.JoinedRoom = this;
            broadcaster.OnConnectionClose += Broadcaster_OnConnectionClose;
            broadcaster.InitCommands();

            _timer = new Timer();
            _timer.Interval = Interval;
            _timer.Elapsed += Timer_Elapsed;
            _timer.Start();
        }

        private void Broadcaster_OnConnectionClose(WebClient client)
        {
            Task.Run(async () => await Hub.RemoveRoom(client.Channel.Id));
        }

        public async Task<SetPixelErrors> SetPixel(WebClient client, string coords, string colorname, bool ignoreHistory)
        {
            if (!ParseCoords(coords, out var xy)) return SetPixelErrors.OutOfRange;
            var color = Colors.FirstOrDefault(c=>c.Name.ToLower() == colorname.ToLower());
            if (color == null) return SetPixelErrors.ColorDidntExists;

            var item = new HistoryItem
            {
                X = xy.x,
                Y = xy.y,
                Coords = coords,
                Color = color,
                Client = client
            };

            if (ignoreHistory)
            {
                Canvas[item.X, item.Y] = item.Color;
                if (item.Client == Broadcaster) await Wideband($"info setpixel {item.Client.Channel.DisplayName} {item.Coords} {item.Color.Name}", item.Client);
                else await Wideband($"info setpixel {item.Client.User.DisplayName} {item.Coords} {item.Color.Name}", item.Client);
            }
            else _history.Enqueue(item);

            return SetPixelErrors.OK;
        }
        
        private void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            Task.Run(async ()=>
            {
                if (!_history.IsEmpty && _history.TryDequeue(out var item) && item.Client.IsConnected && item.Client.IsIdentified)
                {
                    Canvas[item.X, item.Y] = item.Color;
                    if (item.Client == Broadcaster) await Wideband($"info setpixel {item.Client.Channel.DisplayName} {item.Coords} {item.Color.Name}", item.Client);
                    else await Wideband($"info setpixel {item.Client.User.DisplayName} {item.Coords} {item.Color.Name}", item.Client);
                }
            });
        }

        public async Task SetInterval(int interval)
        {
            this.Interval = interval;
            _timer.Interval = interval;
            await Wideband($"info setinterval {interval}", Broadcaster);
        }

        public async Task AddColor(string name, int rgb)
        {
            var existingColor = Colors.FirstOrDefault(c => c.Name.ToLower() == name.ToLower());
            if(existingColor == null)
            {
                Colors.Add(new MyColor(name, rgb));
            }
            else
            {
                existingColor.Update(rgb);
            }
            await Wideband($"info setcolor {name} {rgb}", Broadcaster);
        }

        public async Task SetColors(string palette)
        {
            string[] split = palette.Split(';');
            foreach(var item in split)
            {
                string[] kv = item.Split('=');
                if (kv.Length != 2) continue;
                if (!int.TryParse(kv[1], out var rgb)) continue;
                await AddColor(kv[0], rgb);
            }
        }

        public async Task ClearColors()
        {
            Colors.Clear();
            await Wideband($"info clearpalette", Broadcaster);
        }

        public async Task<bool> SetBackground(string bg)
        {
            if (bg.StartsWith("data:image/png;base64,"))
                bg = bg.Substring("data:image/png;base64,".Length);
            if (!IsBase64String(bg)) return false;

            Background = $"data:image/png;base64,{bg}";

            await Wideband($"info setbackground {Background}", Broadcaster);

            return true;
        }

        public async Task<bool> SetTitle(string title)
        {
            if (title.StartsWith("data:image/png;base64,"))
                title = title.Substring("data:image/png;base64,".Length);
            if (!IsBase64String(title)) return false;

            Title = $"data:image/png;base64,{title}";

            await Wideband($"info settitle {Title}", Broadcaster);

            return true;
        }

        public async Task SetCanvas(string data)
        {
            var pixels = ParseCanvas(data);
            foreach(var pixel in pixels)
            {
                await SetPixel(Broadcaster, pixel.coord, pixel.color, true);
            }
        }

        public string GetCanvasAsString()
        {
            string canvas = "";
            for (int iy = 0; iy < Room.Height; iy++)
            {
                for (int ix = 0; ix < Room.Width; ix++)
                {
                    string hCoord = HorizontalCoords[ix % HorizontalCoords.Count];
                    string vCoord = VerticalCoords[iy % VerticalCoords.Count];
                    string pixelInfo = $"{hCoord}{vCoord}={Canvas[ix, iy].Name};";
                    canvas += pixelInfo;
                }
            }
            return canvas;
        }

        public string GetCanvasAsBase64()
        {
            string ret;
            using (Bitmap btm = new Bitmap(Width, Height))
            {
                var g = Graphics.FromImage(btm);
                for (int iy = 0; iy < Room.Height; iy++)
                {
                    for (int ix = 0; ix < Room.Width; ix++)
                    {
                        var bytes = BitConverter.GetBytes(Canvas[ix, iy].RGB);
                        btm.SetPixel(ix, iy, Color.FromArgb(bytes[0], bytes[1], bytes[2]));
                    }
                }

                using (System.IO.MemoryStream stream = new System.IO.MemoryStream())
                {
                    btm.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] imageBytes = stream.ToArray();
                    ret = Convert.ToBase64String(imageBytes);
                }
            }
            return $"data:image/png;base64,{ret}";
        }

        public bool AddViewer(WebClient client)
        {
            if(client.User != null)
            {
                Viewers.TryAdd(client.User.Id, client);
                client.JoinedRoom = this;
                client.OnConnectionClose += Client_OnConnectionClose;
                client.InitCommands();
                return true;
            }
            return false;
        }

        private void Client_OnConnectionClose(WebClient client)
        {
            if(Viewers.ContainsKey(client.User.Id))
            {
                Viewers.Remove(client.User.Id, out _);
            }
        }

        public async Task Wideband(string message, WebClient sender, bool ignoreSernder = true)
        {
            if(sender != Broadcaster || !ignoreSernder)
            {
                await Broadcaster.SendMessage(message);
            }
            foreach(var viewer in Viewers.Values)
            {
                if(viewer != sender || !ignoreSernder)
                {
                    await viewer.SendMessage(message);
                }
            }
        }

        public async Task<bool> Kick(string username, string reason)
        {
            var res = Viewers.Values.FirstOrDefault(v => v.User != null && v.User.Login.ToLower() == username.ToLower());
            if (res != null) return await Kick(res.User.Id, reason);
            else return false;
        }

        public async Task<bool> Kick(int id, string reason)
        {
            if (Viewers.TryRemove(id, out var viewer))
            {
                viewer.ResetIdentify();
                viewer.OnConnectionClose -= Client_OnConnectionClose;
                await viewer.SendInfo("kicked", reason);
                return true;
            }
            else return false;
        }

        public async Task KickViewers()
        {
            foreach (var kv in Viewers)
            {
                await Kick(kv.Key, "room_destroyed");
            }
        }

        public async Task KickAll()
        {
            await KickViewers();

            Broadcaster.ResetIdentify();
            Broadcaster.OnConnectionClose -= Broadcaster_OnConnectionClose;
            await Broadcaster.SendInfo("kicked", "room_destroyed");
        }

        private List<(string coord, string color)> ParseCanvas(string data)
        {
            List<(string coords, string color)> ret = new List<(string coords, string color)>();
            string[] split = data.Split(';');
            foreach(var item in split)
            {
                string[] kv = item.Split('=');
                if (kv.Length != 2) continue;
                if (!Colors.Any(c => c.Name == kv[1])) continue;
                if (!ParseCoords(kv[0], out var xy)) continue;

                ret.Add((kv[0], kv[1]));
            }
            return ret;
        }

        private bool ParseCoords(string str, out (int x, int y) coords)
        {
            str = str.ToUpper();
            coords = (0, 0);

            string hor = "";
            string vert = "";
            for (int i = 0; i < str.Length; i++)
            {
                hor = str.Substring(0, str.Length - i);
                if (HorizontalCoords.Contains(hor))
                {
                    vert = str.Substring(str.Length - i);
                    break;
                }
            }

            if (!HorizontalCoords.Contains(hor)) return false;
            if (!VerticalCoords.Contains(vert)) return false;

            int x = HorizontalCoords.IndexOf(hor);
            int y = VerticalCoords.IndexOf(vert);

            coords = (x, y);

            return true;
        }

        private bool IsBase64String(string base64)
        {
            Span<byte> buffer = new Span<byte>(new byte[base64.Length]);
            return Convert.TryFromBase64String(base64, buffer, out int bytesParsed);
        }

        public enum SetPixelErrors
        {
            OK, OutOfRange, ColorDidntExists
        }
    }
}