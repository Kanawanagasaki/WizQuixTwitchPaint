class GetCanvasCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("getcanvas", client);
    }

    public OnInfo(data: string[])
    {
        let canvas = data.join(" ");
        this.Client.Canvas.ParceCanvas(canvas);
    }

    public OnError(code: number, error: string)
    {
        
    }
    
}