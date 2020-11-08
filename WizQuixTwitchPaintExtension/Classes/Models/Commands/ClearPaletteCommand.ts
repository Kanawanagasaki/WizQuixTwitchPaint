class ClearPaletteCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("clearpalette", client);
    }

    public OnInfo(data: string[])
    {
        this.Client.Canvas.Palette.ClearPalette();
    }

    public OnError(code: number, error: string)
    {
        
    }
}