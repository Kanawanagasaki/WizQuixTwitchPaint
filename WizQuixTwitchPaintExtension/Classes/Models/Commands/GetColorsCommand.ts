class GetColorsCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("getcolors", client);
    }

    public OnInfo(data: string[])
    {
        let palette = data.join(" ");
        this.Client.Canvas.Palette.ClearPalette();
        this.Client.Canvas.Palette.ParseColors(palette);
    }

    public OnError(code: number, error: string)
    {
        
    }
    
}