using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WizQuixTwitchPaint.Model;

namespace WizQuixTwitchPaint.View
{
    public class ColorsPanel : Panel
    {
        private const int _padding = 32;
        private Colors _colors;

        public ColorsPanel(Colors colors)
        {
            this._colors = colors;

            this.DoubleBuffered = true;
            this.Dock = DockStyle.Fill;

            this.Paint += ColorsPanel_Paint;
            this.MouseClick += ColorsPanel_MouseClick;

            this.Resize += ColorsPanel_Resize;

            this._colors.OnClear += _colors_OnClear;
            this._colors.OnParse += _colors_OnParse;
        }

        private void _colors_OnParse()
        {
            MethodInvoker d = delegate ()
            {
                this.Refresh();
            };
            this.Invoke(d);
        }

        private void _colors_OnClear()
        {
            MethodInvoker d = delegate ()
            {
                this.Refresh();
            };
            this.Invoke(d);
        }

        private void ColorsPanel_Resize(object sender, EventArgs e)
        {
            this.Refresh();
        }

        private void ColorsPanel_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.Clear(Color.Black);

            int itemsInRow = (int)Math.Sqrt(_colors.List.Count);
            if (itemsInRow == 0) return;

            float width = this.Width - _padding * 2;

            float colorSize = width / itemsInRow;

            for(int i = 0; i < _colors.List.Count; i++)
            {
                int ix = i % itemsInRow;
                int iy = i / itemsInRow;

                float x1 = _padding + ix * colorSize;
                float y1 = _padding + iy * colorSize;

                g.FillRectangle(_colors.List[i].Brush, x1 + 1, y1 + 1, colorSize - 2, colorSize - 2);
            }

            int gx = _colors.SelectedIndex % itemsInRow;
            int gy = _colors.SelectedIndex / itemsInRow;

            float gx1 = _padding + gx * colorSize;
            float gy1 = _padding + gy * colorSize;

            g.DrawRectangle(_colors.GoldPen, gx1, gy1, colorSize, colorSize);
        }

        private void ColorsPanel_MouseClick(object sender, MouseEventArgs e)
        {
            int itemsInRow = (int)Math.Sqrt(_colors.List.Count);
            float width = this.Width - _padding * 2;
            float height = this.Height - _padding * 2;
            float colorSize = width / itemsInRow;

            float mx = e.X - _padding;
            float my = e.Y - _padding;

            if (mx < 0 || mx > width) return;
            if (my < 0 || my > height) return;

            float rx = mx / width;

            int px = (int)(rx * itemsInRow);
            int py = (int)(my / colorSize);

            _colors.SelectedIndex = px + py * itemsInRow;

            this.Refresh();
        }
    }
}
