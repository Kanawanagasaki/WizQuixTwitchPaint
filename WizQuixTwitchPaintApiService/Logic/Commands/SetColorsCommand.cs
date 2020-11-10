using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: setcolors <palette:string> // palette in format: <<colorname:string>=<colorrgb:int>;[]>
        on success: info setcolors OK
        examples:
        - setcolors red=16711680;blue=255;green=65280;
        - setcolors Black=0;White=16777215;
     */
    public class SetColorsCommand : ACommand
    {
        public SetColorsCommand(WebClient client) : base("setcolors", client) { }

        public override async Task Execute(string[] args)
        {
            string palette = string.Join(" ", args);
            await Client.JoinedRoom.SetColors(palette);
            await SendInfo();
        }
    }
}
