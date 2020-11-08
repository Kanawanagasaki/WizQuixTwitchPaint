class SetColorCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("setcolor", client);
    }

    public OnInfo(data: string[])
    {
        if(data.length != 2) return;
        let colorname = data[0];
        let colorrgb = parseInt(data[1]);
        if(isNaN(colorrgb)) return;

        this.Client.Canvas.Palette.AddOrUpdateColor(colorname, colorrgb);
    }
    
    public OnError(code: number, error: string)
    {
        
    }
    
}