using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WizQuixTwitchPaint.Model
{
    public class SolidColor
    {
        public string Name { get; private set; }
        public string Hex { get; private set; }
        public Color Color { get; private set; }
        public SolidBrush Brush { get; private set; }
        public Pen Pen { get; private set; }

        public SolidColor(string name, string hex)
        {
            this.Name = name;
            this.Hex = hex.StartsWith("#") ? hex : $"${hex}";
            this.Color = ColorTranslator.FromHtml(this.Hex);
            this.Brush = new SolidBrush(this.Color);
            this.Pen = new Pen(this.Brush);
        }

        public SolidColor(string name, Color color)
        {
            this.Name = name;
            this.Color = color;
            this.Hex = ColorTranslator.ToHtml(this.Color);
            this.Brush = new SolidBrush(this.Color);
            this.Pen = new Pen(this.Brush);
        }
    }
}
