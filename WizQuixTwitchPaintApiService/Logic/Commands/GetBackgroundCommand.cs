using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: getbackground
        on success: info getbackground <image:string> // image is a base64 encoded png image (data:image/png;base64,<Base64>)
     */
    public class GetBackgroundCommand : ACommand
    {
        public GetBackgroundCommand(WebClient client) : base("getbackground", client) { }

        public override async Task Execute(string[] args)
        {
            await SendInfo(Client.JoinedRoom.Background);
        }
    }
}
