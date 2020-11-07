using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: getcanvas
        on success: info getcanvas <canvas:string> // canvas in format: <<coordinate:string>=<colorname:string>;[]> coordinate in formal <letter:char><number:int>
    */
    public class GetCanvasCommand : ACommand
    {
        public GetCanvasCommand(WebClient client) : base("getcanvas", client) { }

        public override async Task Execute(string[] args)
        {
            string canvas = Client.JoinedRoom.GetCanvasAsString();
            await Client.SendMessage($"info getcanvas {canvas}");
        }
    }
}
