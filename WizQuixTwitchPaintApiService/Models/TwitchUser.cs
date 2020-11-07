using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Models
{
    public class TwitchUser
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string DisplayName { get; set; }
    }
}
