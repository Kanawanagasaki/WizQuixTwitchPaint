using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WizQuixTwitchPaint.Model
{
    public class HistoryItem
    {
        public int X { get; private set; }
        public int Y { get; private set; }
        public SolidColor Color { get; private set; }

        public HistoryItem(int x, int y, SolidColor c)
        {
            this.X = x;
            this.Y = y;
            this.Color = c;
        }
    }
}
