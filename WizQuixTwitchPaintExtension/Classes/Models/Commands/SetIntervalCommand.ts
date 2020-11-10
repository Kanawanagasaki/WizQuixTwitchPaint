class SetIntervalCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("setinterval", client);
    }

    public OnInfo(data: string[])
    {
        if(data.length < 0) return;
        var num = parseInt(data[0]);
        if(num <= 0) return;
        this.Client.Interval = num;
    }

    public OnError(code: number, error: string) 
    {
        
    }
}