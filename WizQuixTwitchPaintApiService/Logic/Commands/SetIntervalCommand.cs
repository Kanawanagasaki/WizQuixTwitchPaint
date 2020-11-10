using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public class SetIntervalCommand : ACommand
    {
        public SetIntervalCommand(WebClient client) : base("setinterval", client) { }

        public override async Task Execute(string[] args)
        {
            if (args.Length < 1)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }
            if(!int.TryParse(args[0], out var interval))
            {
                await SendError(WebClient.HttpCodes.Code400, "Interval must be a number");
                return;
            }
            if (interval <= 0)
            {
                await SendError(WebClient.HttpCodes.Code400, "Interval must be greater than 0");
                return;
            }

            await Client.JoinedRoom.SetInterval(interval);

            await SendInfo();
        }
    }
}
