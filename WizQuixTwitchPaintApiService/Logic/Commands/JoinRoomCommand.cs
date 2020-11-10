using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public class JoinRoomCommand : ACommand
    {
        public JoinRoomCommand(WebClient client) : base("joinroom", client) { }

        public override async Task Execute(string[] args)
        {
            if (args.Length < 2)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }

            string broadcaster = args[0];
            if (int.TryParse(broadcaster, out int channelid))
                await Client.SetChannel(channelid);
            else
                await Client.SetChannel(broadcaster);

            string viewer = args[1];
            if (int.TryParse(viewer, out int viewerid))
                await Client.SetUser(viewerid);
            else
                await Client.SetUser(viewer);

            Client.Identify(false);

            var status = Hub.JoinRoom(Client);

            if (status.status)
                await SendInfo();
            else
                await SendError(status.code, status.reason);
        }
    }
}
