using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public class GetIntervalCommand : ACommand
    {
        public GetIntervalCommand(WebClient client) : base("getinterval", client) { }

        public override async Task Execute(string[] args)
        {
            await SendInfo(Client.JoinedRoom.Interval.ToString());
        }
    }
}
