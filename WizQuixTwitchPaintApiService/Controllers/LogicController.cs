using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WizQuixTwitchPaintApiService.Logic;

namespace WizQuixTwitchPaintApiService.Controllers
{
    [ApiController]
    [Route("api")]
    public class LogicController : ControllerBase
    {
        private readonly ILogger<LogicController> _logger;

        public LogicController(ILogger<LogicController> logger)
        {
            _logger = logger;
        }

        [HttpGet("rooms/{page}")]
        public List<dynamic> GetRooms(int page)
        {
            List<dynamic> ret = new List<dynamic>();
            foreach(var room in Hub.Rooms.Values.Skip(page * 20).Take(20))
            {
                ret.Add(new
                {
                    name = room.Name,
                    broadcaster = room.Broadcaster.Channel,
                    viewers_count = room.Viewers.Count,
                    viewers = room.Viewers.Values.Select(v => v.User),
                    colors = room.Colors,
                    background = room.Background,
                    canvas = room.GetCanvasAsBase64()
                });
            }

            return ret;
        }
    }
}
