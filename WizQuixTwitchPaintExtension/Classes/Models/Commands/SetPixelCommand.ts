class SetPixelCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("setpixel", client);
    }

    public OnInfo(data: string[])
    {
        if(data.length == 1 && data[0] == "OK") return;
        if(data.length < 3) return;

        let nickname = data[0];
        let coordStr = data[1];
        let colorname = data.slice(2).join(" ");

        let coords = this.Client.Canvas.ParseCoordinate(coordStr);
        if(coords === undefined) return;

        let color = this.Client.Canvas.Palette.GetColorByName(colorname);
        if(color === undefined) return;

        this.Client.Canvas.SetPixel(coords.x, coords.y, color, true);
    }

    public OnError(code: number, error: string)
    {
        
    }
}