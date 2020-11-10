using WizQuixTwitchPaintApiService.Logic;

namespace WizQuixTwitchPaintApiService.Models
{
    public class HistoryItem
    {
        public int X { get; set; }
        public int Y { get; set; }
        public string Coords { get; set; }
        public MyColor Color { get; set; }
        public WebClient Client { get; set; }
    }
}
