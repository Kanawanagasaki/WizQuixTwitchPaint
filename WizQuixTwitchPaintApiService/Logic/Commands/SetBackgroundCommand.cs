using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: setbackground <image:string> // image is a base64 encoded png image (data:image/png;base64,<Base64>)
        on success: info setbackground OK
        on fail:
        - error setbackground 400 Bad base64 encoding
	    - error setbackground 400 Wrong number of arguments 
        examples:
        - setbackground data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=
     */

    public class SetBackgroundCommand : ACommand
    {
        public SetBackgroundCommand(WebClient client) : base("setbackground", client) { }

        public override async Task Execute(string[] args)
        {
            if(args.Length < 1)
            {
                await Client.SendMessage("error setbackground 400 Wrong number of arguments");
                return;
            }
            bool res = await Client.JoinedRoom.SetBackground(string.Join(" ", args));
            if(res) await Client.SendMessage("info setbackground OK");
            else await Client.SendMessage("error setbackground 400 Bad base64 encoding");
        }
    }
}
