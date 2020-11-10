using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: gettitle
        on success: info gettitle <image:string> // image is a base64 encoded png image (data:image/png;base64,<Base64>)
     */
    public class GetTitleCommand : ACommand
    {
        public GetTitleCommand(WebClient client) : base("gettitle", client) { }

        public override async Task Execute(string[] args)
        {
            await SendInfo(Client.JoinedRoom.Title);
        }
    }
}
