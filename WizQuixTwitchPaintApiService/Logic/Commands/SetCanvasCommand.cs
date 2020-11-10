using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    /*
        command: setcanvas <canvas:string> // canvas in format: <<coordinate:string>=<colorname:string>;[]>, coordinate in formal: <letter:char><number:int>, colornames should be sent earlier
        on success: info setcanvas OK 
        examples:
	        - setcanvas A1=Red;A2=Blue;A3=Green;F11=Semi Light Semi Dark Random Color;A4=Black;A5=Light Gray;
     */

    public class SetCanvasCommand : ACommand
    {
        public SetCanvasCommand(WebClient client) : base("setcanvas", client) { }

        public override async Task Execute(string[] args)
        {
            string canvas = string.Join(" ", args);
            await Client.JoinedRoom.SetCanvas(canvas);
            await SendInfo();
        }
    }
}
