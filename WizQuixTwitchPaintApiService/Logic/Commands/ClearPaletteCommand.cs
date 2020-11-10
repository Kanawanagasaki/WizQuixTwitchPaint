using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: clearpalette // this command will clear the palette
        on success: info clearpalette OK
     */
    public class ClearPaletteCommand : ACommand
    {
        public ClearPaletteCommand(WebClient client) : base("clearpalette", client) { }

        public override async Task Execute(string[] args)
        {
            await Client.JoinedRoom.ClearColors();
            await SendInfo();
        }
    }
}
