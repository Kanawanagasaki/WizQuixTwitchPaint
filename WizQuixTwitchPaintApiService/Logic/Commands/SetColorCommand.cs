using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: setcolor <colorname:string> <colorrgb:int>
        on success: info setcolor OK
        on fail:
        - error setcolor 400 colorrgb should be an integer
	    - error setcolor 400 Wrong number of arguments 
        examples:
        - setcolor red 16711680
        - setcolor BLACK 0
     */

    public class SetColorCommand : ACommand
    {
        public SetColorCommand(WebClient client) : base("setcolor", client) { }

        public override async Task Execute(string[] args)
        {
            if (args.Length < 2)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }
            if(!int.TryParse(args[1], out int rgb))
            {
                await SendError(WebClient.HttpCodes.Code400, "'colorrgb' should be an integer");
                return;
            }
            await Client.JoinedRoom.AddColor(args[0], rgb);
            await SendInfo();
        }
    }
}
