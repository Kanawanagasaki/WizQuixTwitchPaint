class SetBackgroundCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("setbackground", client);
    }

    public OnInfo(data: string[])
    {
        let base64 = data.join(" ");
        this.Client.SetBackground(base64);
    }

    public OnError(code: number, error: string)
    {
        
    }

}