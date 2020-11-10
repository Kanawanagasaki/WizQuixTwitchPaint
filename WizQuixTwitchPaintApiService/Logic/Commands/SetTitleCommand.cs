using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: settitle <image:string> // image is a base64 encoded png image (data:image/png;base64,<Base64>)
        on success: info setbackground OK
        on fail:
	        - error setbackground 400 Bad base64 encoding
	        - error setbackground 400 Wrong number of arguments
     */
    public class SetTitleCommand : ACommand
    {
        public SetTitleCommand(WebClient client) : base("settitle", client) { }

        public override async Task Execute(string[] args)
        {
            if (args.Length < 1)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }
            bool res = await Client.JoinedRoom.SetTitle(string.Join(" ", args));
            if (res) await SendInfo();
            else await SendError(WebClient.HttpCodes.Code400, "Bad base64 encoding");
        }
    }
}
