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
        public string Hex { get; set; }

        public MyColor(string name, int rgb)
        {
            RGB = rgb;
            Name = name;

            var bytes = BitConverter.GetBytes(rgb).Take(3).ToArray();
            Hex = "#"+BitConverter.ToString(bytes).Replace("-", "");
        }

        public MyColor(string name, string hex)
        {
            if (!hex.StartsWith("#")) hex = $"#{hex}";

            Hex = hex;
            Name = name;

            RGB = int.Parse(new string(hex.Substring(1).Reverse().ToArray()), System.Globalization.NumberStyles.HexNumber);
        }

        internal void Update(int rgb)
        {
            RGB = rgb;
            var bytes = BitConverter.GetBytes(rgb).Take(3).ToArray();
            Hex = "#" + BitConverter.ToString(bytes).Replace("-", "");
        }
    }
}
