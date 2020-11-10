using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public class KickCommand : ACommand
    {
        public KickCommand(WebClient client) : base("kick", client) { }

        public override async Task Execute(string[] args)
        {
            if(args.Length < 1)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }

            string reason = "";
            if(args.Length > 1)
            {
                reason = string.Join(" ", args.Skip(1));
            }

            bool res = false;
            if(int.TryParse(args[0], out var userid))
                res = await Client.JoinedRoom.Kick(userid, reason);
            else
                res = await Client.JoinedRoom.Kick(args[0], reason);

            await SendInfo();
        }
    }
}
