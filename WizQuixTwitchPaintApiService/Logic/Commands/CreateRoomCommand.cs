using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public class CreateRoomCommand : ACommand
    {
        public CreateRoomCommand(WebClient client) : base("createroom", client) { }

        public override async Task Execute(string[] args)
        {
            if(args.Length < 1)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }

            string broadcaster = args[0];
            if(int.TryParse(broadcaster, out int id))
                await Client.SetChannel(id);
            else
                await Client.SetChannel(broadcaster);

            Client.Identify(true);

            var status = await Hub.CreateRoom(Client);

            if (status.status)
                await SendInfo();
            else
                await SendError(status.code, status.reason);
        }
    }
}
