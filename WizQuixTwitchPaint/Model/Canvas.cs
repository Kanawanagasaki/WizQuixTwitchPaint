using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace WizQuixTwitchPaint.Model
{
    public class Canvas
    {
        public readonly int Width;
        public readonly int Height;

        private SolidColor[,] _pixels;

        public Colors Colors;

        public List<HistoryItem> History = new List<HistoryItem>();

        private const string _letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        public List<string> VerticalCoords { get; private set; }
        public List<string> HorizontalCoords { get; private set; }

        public Canvas(Colors colors, int width, int height)
        {
            this.Colors = colors;
            this.Colors.OnClear += Colors_OnClear;

            this.Width = width;
            this.Height = height;

            this.VerticalCoords = Enumerable.Range(1, Height).Select(n => $"{n}").ToList();
            this.HorizontalCoords = Enumerable.Range(0, Width).Select(n => $"{_letters[n % _letters.Length]}").ToList();

            this._pixels = new SolidColor[this.Width, this.Height];
            for (int iy = 0; iy < this.Height; iy++)
            {
                for(int ix = 0; ix < this.Width; ix++)
                {
                    this._pixels[ix, iy] = Colors.NullColor;
                }
            }
        }

        private void Colors_OnClear()
        {
            for (int iy = 0; iy < this.Height; iy++)
            {
                for (int ix = 0; ix < this.Width; ix++)
                {
                    this._pixels[ix, iy] = this.Colors.NullColor;
                }
            }
            this.History.Clear();
        }

        public void SetPixel(int x, int y)
        {
            this.SetPixel(x, y, this.Colors.SelectedColor);
        }

        public void SetPixel(int x, int y, SolidColor color, bool ingoreHistory = false)
        {
            if (x < 0 || x >= this.Width) return;
            if (y < 0 || y >= this.Height) return;

            if(this._pixels[x, y] != color)
            {
                this._pixels[x, y] = color;
                if(!ingoreHistory)
                    this.History.Add(new HistoryItem(x, y, color));
            }
        }

        public SolidColor GetPixel(int x, int y)
        {
            if (x < 0 || x >= this.Width) return null;
            if (y < 0 || y > this.Height) return null;

            return this._pixels[x, y];
        }

        public void SetPixelFromChat(string chat, string color)
        {
            if (!GetCoordsFromChat(chat, out var coords)) return;
            var solid = this.Colors.GetByName(color);
            if (solid == this.Colors.NullColor) return;
            if (this.History.Any(h => h.X == coords.x && h.Y == coords.y)) return;

            this.SetPixel(coords.x, coords.y, solid, true);
        }

        private bool GetCoordsFromChat(string chat, out (int x, int y) coords)
        {
            coords = (0, 0);

            string hor = "";
            string vert = "";
            for(int i = 0; i < chat.Length; i++)
            {
                hor = chat.Substring(0, chat.Length - i);
                if(HorizontalCoords.Contains(hor))
                {
                    vert = chat.Substring(chat.Length - i);
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

        public void ParseImage(Image btm)
        {
            var resized = this.ResizeImage(btm, this.Width, this.Height);
            for(int iy = 0; iy < Height; iy++)
            {
                for(int ix = 0; ix < Width; ix++)
                {
                    var pixel = resized.GetPixel(ix,iy);
                    var closest = this.Colors.GetClosest(pixel);
                    this.SetPixel(ix,iy,closest);
                }
            }
            resized.Dispose();
        }

        private Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
    }
}
