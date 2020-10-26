using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WizQuixTwitchPaint.Model
{
    public class Colors
    {
        public readonly Pen GoldPen = new Pen(Color.Gold) { Width = 3 };
        public readonly SolidColor NullColor = new SolidColor("Null", "#202020");

        public readonly List<SolidColor> List = new List<SolidColor>()
        {
            new SolidColor( "Red",            "#FF3333" ),
            new SolidColor( "Light Red",      "#FF9999" ),
            new SolidColor( "Dark Red",       "#990000" ),
            new SolidColor( "Orange",         "#FF9933" ),
            new SolidColor( "Light Orange",   "#FFCC99" ),
            new SolidColor( "Dark Orange",    "#994C00" ),
            new SolidColor( "Yellow",         "#FFFF33" ),
            new SolidColor( "Light Yellow",   "#FFFF99" ),
            new SolidColor( "Dark Yellow",    "#999900" ),
            new SolidColor( "Lime",           "#99FF33" ),
            new SolidColor( "Light Lime",     "#CCFF99" ),
            new SolidColor( "Dark Lime",      "#4C9900" ),
            new SolidColor( "Green",          "#33FF33" ),
            new SolidColor( "Light Green",    "#99FF99" ),
            new SolidColor( "Dark Green",     "#009900" ),
            new SolidColor( "Aqua",           "#33FF99" ),
            new SolidColor( "Light Aqua",     "#99FFCC" ),
            new SolidColor( "Dark Aqua",      "#00994C" ),
            new SolidColor( "Cyan",           "#33FFFF" ),
            new SolidColor( "Light Cyan",     "#99FFFF" ),
            new SolidColor( "Dark Cyan",      "#009999" ),
            new SolidColor( "Blue",           "#3399FF" ),
            new SolidColor( "Light Blue",     "#99CCFF" ),
            new SolidColor( "Dark Blue",      "#004C99" ),
            new SolidColor( "Indigo",         "#3333FF" ),
            new SolidColor( "Light Indigo",   "#9999FF" ),
            new SolidColor( "Dark Indigo",    "#000099" ),
            new SolidColor( "Violet",         "#9933FF" ),
            new SolidColor( "Light Violet",   "#CC99FF" ),
            new SolidColor( "Dark Violet",    "#4C0099" ),
            new SolidColor( "Pink",           "#FF33FF" ),
            new SolidColor( "Light Pink",     "#FF99FF" ),
            new SolidColor( "Dark Pink",      "#990099" ),
            new SolidColor( "Ruby",           "#FF3399" ),
            new SolidColor( "Light Ruby",     "#FF99CC" ),
            new SolidColor( "Dark Ruby",      "#99004C" ),
            new SolidColor( "White",          "#FFFFFF" ),
            new SolidColor( "Light Grey",     "#E0E0E0" ),
            new SolidColor( "Grey",           "#808080" ),
            new SolidColor( "Dark Grey",      "#404040" ),
            new SolidColor( "Light Black",    "#202020" ),
            new SolidColor( "Black",          "#000000" )
        };
        private Dictionary<string, SolidColor> _dictionary;

        private int _selectedColor = 0;
        public int SelectedIndex
        {
            get => _selectedColor;
            set => _selectedColor = Math.Min(this.List.Count - 1, Math.Max(0, value));
        }

        public SolidColor SelectedColor => this.List.Count > 0 ? this.List[this.SelectedIndex] : this.NullColor;

        public delegate void Cleared();
        public event Cleared OnClear;
        public delegate void Parsed();
        public event Parsed OnParse;

        public Colors()
        {
            this.LoadDictionary();
        }

        public void Clear()
        {
            this._dictionary.Clear();
            this.List.Clear();
            OnClear?.Invoke();
        }

        public void ParseColors(string colors)
        {
            string[] lines = colors.Split(';');
            foreach(var line in lines)
            {
                string[] color = line.Split('=');
                if (color.Length != 2) continue;
                if (!int.TryParse(color[1], out var colorInt)) continue;
                if (this.List.Any(sc => sc.Name == color[0])) continue;
                var bytes = BitConverter.GetBytes(colorInt);
                this.List.Add(new SolidColor(color[0], Color.FromArgb(bytes[0], bytes[1], bytes[2])));
            }
            this.LoadDictionary();
            this.OnParse?.Invoke();
        }

        private void LoadDictionary()
        {
            _dictionary = new Dictionary<string, SolidColor>();
            foreach (var color in List)
            {
                string colorname = color.Name.ToLower().Replace(" ", "");
                if(!this._dictionary.ContainsKey(colorname))
                {
                    _dictionary.Add(colorname, color);
                }
            }
        }

        public bool HasColor(SolidColor color)
        {
            return List.Contains(color);
        }

        public SolidColor GetByName(string name)
        {
            name = name.ToLower().Replace(" ", "");
            if (name == "null") return NullColor;
            else if (_dictionary.ContainsKey(name)) return _dictionary[name];
            else return NullColor;
        }

        public SolidColor GetClosest(Color color)
        {
            return List.OrderBy(c => ColorDiff(c.Color, color)).First();
        }

        private int ColorDiff(Color c1, Color c2)
        {
            return (int)Math.Sqrt((c1.R - c2.R) * (c1.R - c2.R)
                                   + (c1.G - c2.G) * (c1.G - c2.G)
                                   + (c1.B - c2.B) * (c1.B - c2.B));
        }
    }
}
