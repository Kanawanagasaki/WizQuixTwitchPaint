using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TwitchLib.Api.Helix.Models.Analytics;
using WizQuixTwitchPaint.Model;

namespace WizQuixTwitchPaint.View
{
    public class CanvasPanel : Panel
    {
        private const int _padding = 32;

        private Canvas _canvas;

        private int _mouseX = 0;
        private int _mouseY = 0;
        private bool _isMouseDown = false;

        private static readonly StringFormat _stringFormat = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

        private Timer _timer;

        public CanvasPanel(Canvas canvas)
        {
            this._canvas = canvas;

            this.DoubleBuffered = true;
            this.Dock = DockStyle.Fill;

            this.Paint += CanvasPanel_Paint;
            this.MouseMove += CanvasPanel_MouseMove;
            this.MouseDown += CanvasPanel_MouseDown;
            this.MouseUp += CanvasPanel_MouseUp;

            this._timer = new Timer();
            this._timer.Enabled = true;
            this._timer.Interval = 20;
            this._timer.Tick += _timer_Tick;
        }

        private void _timer_Tick(object sender, EventArgs e)
        {
            this.Refresh();
        }

        private void CanvasPanel_MouseUp(object sender, MouseEventArgs e)
        {
            this._isMouseDown = false;
        }

        private void CanvasPanel_MouseDown(object sender, MouseEventArgs e)
        {
            this._isMouseDown = true;
            var pos = GetCoordsFromPoint(e.X, e.Y);
            this._canvas.SetPixel(pos.x, pos.y);
        }

        private void CanvasPanel_MouseMove(object sender, MouseEventArgs e)
        {
            var pos = GetCoordsFromPoint(e.X, e.Y);
            this._mouseX = pos.x;
            this._mouseY = pos.y;

            if(this._isMouseDown)
            {
                this._canvas.SetPixel(pos.x, pos.y);
            }
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.Clear(Color.Black);

            float pixelSize = this.PixelSize();
            float top = GetTop();
            float left = GetLeft();

            for(int iy = 0; iy < this._canvas.Height; iy++)
            {
                for(int ix = 0; ix < this._canvas.Width; ix++)
                {
                    float x1 = left + ix * pixelSize;
                    float y1 = top + iy * pixelSize;

                    var pixel = this._canvas.GetPixel(ix, iy);

                    g.FillRectangle(pixel.Brush, x1, y1, pixelSize, pixelSize);
                }
            }

            float bx1 = left + _mouseX * pixelSize;
            float by1 = top + _mouseY * pixelSize;

            g.DrawRectangle(_canvas.Colors.GoldPen, bx1, by1, pixelSize, pixelSize);

            var vertical = _canvas.VerticalCoords;
            for (int i = 0; i < vertical.Count; i++)
                g.DrawString(vertical[i], Font, Brushes.White, left / 2, top + i * pixelSize + pixelSize / 2, _stringFormat);

            float bottom = GetBottom();
            var horizontal = _canvas.HorizontalCoords;
            for (int i = 0; i < horizontal.Count; i++)
                g.DrawString(horizontal[i], Font, Brushes.White, left + i * pixelSize + pixelSize / 2, bottom + _padding / 2, _stringFormat);

            g.DrawRectangle(Pens.White, top - 1, left - 1, GetWidth() + 1, GetHeight() + 1);
        }

        private (int x, int y) GetCoordsFromPoint(float px, float py)
        {
            float top = GetTop();
            float height = GetBottom() - top;

            float left = GetLeft();
            float width = GetRight() - left;

            px -= left;
            py -= top;

            float rx = (float)px / (float)width;
            float ry = (float)py / (float)height;

            int x = (int)(rx * _canvas.Width);
            int y = (int)(ry * _canvas.Height);

            x = Math.Min(_canvas.Width-1, Math.Max(0, x));
            y = Math.Min(_canvas.Height-1, Math.Max(0, y));

            return (x, y);
        }

        private float GetTop()
        {
            return _padding + 1;
        }

        private float GetLeft()
        {
            return _padding + 1;
        }

        private float GetBottom()
        {
            float px = this.PixelSize();
            float top = this.GetTop();
            float height = px * _canvas.Height;
            return top + height;
        }

        private float GetRight()
        {
            float px = this.PixelSize();
            float left = this.GetLeft();
            float width = px * _canvas.Width;
            return left + width;
        }

        private float GetWidth()
        {
            return GetRight() - GetLeft();
        }

        private float GetHeight()
        {
            return GetBottom() - GetTop();
        }
        
        private float PixelSize()
        {
            float minVH = Math.Min(this.Width, this.Height);
            minVH -= _padding * 2;
            minVH -= 2;

            float pixelSize = minVH / this._canvas.Width;
            return pixelSize;
        }
    }
}
