using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: getcolors
        on success: info getcolors <palette:string> // palette in format: <<colorname:string>=<colorrgb:int>;[]>
     */
    public class GetColorsCommand : ACommand
    {
        public GetColorsCommand(WebClient client) : base("getcolors", client) { }

        public override async Task Execute(string[] args)
        {
            var colors = Client.JoinedRoom.Colors.ToArray();
            string palette = string.Join("", colors.Select(c=>$"{c.Name}={c.RGB};"));
            await Client.SendMessage($"info getcolors {palette}");
        }
    }
}
