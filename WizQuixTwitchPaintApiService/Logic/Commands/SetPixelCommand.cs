using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /// command: setpixel <coordinate:string> <colorname:string> // coordinate in formal <letter:char><number:int>
    /// on success: info setpixel OK
    /// on fail:
    ///    - error setpixel 404 Color '<colorname:string>' didn't exists
    ///    - error setpixel 400 Coordinate is out of range
    ///    - error setpixel 400 Wrong number of arguments 
    /// examples:
    ///    - setpixel A1 Red
    ///    - setpixel d13 blue
    public class SetPixelCommand : ACommand
    {
        public SetPixelCommand(WebClient client) : base("SetPixel", client) { }

        public override async Task Execute(string[] args)
        {
            if(args.Length < 2)
            {
                await SendError(WebClient.HttpCodes.Code400, "Wrong number of arguments");
                return;
            }

            var colorname = string.Join(" ", args.Skip(1).ToArray());
            var res = await Client.JoinedRoom.SetPixel(Client, args[0], colorname, false);
            switch(res)
            {
                case Room.SetPixelErrors.ColorDidntExists:
                    await SendError(WebClient.HttpCodes.Code404, $"Color '{args[1]}' didn't exists");
                    break;
                case Room.SetPixelErrors.OutOfRange:
                    await SendError(WebClient.HttpCodes.Code400, "Coordinate is out of range");
                    break;
                case Room.SetPixelErrors.OK:
                    await SendInfo();
                    break;
            }
        }
    }
}
