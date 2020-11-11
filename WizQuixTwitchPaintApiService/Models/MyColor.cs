using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Models
{
    public class MyColor
    {
        public int RGB { get; set; }
        public string Name { get; set; }

        public MyColor(string name, int rgb)
        {
            RGB = rgb;
            Name = name;
        }

        public MyColor(string name, string hex)
        {
            if (hex.StartsWith("#")) hex = hex.Substring(1);
            RGB = int.Parse(hex, System.Globalization.NumberStyles.HexNumber);
            Name = name;
        }

        internal void Update(int rgb)
        {
            RGB = rgb;
            var bytes = BitConverter.GetBytes(rgb).Take(3).ToArray();
        }
    }
}
