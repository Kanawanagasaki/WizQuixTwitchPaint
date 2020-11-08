class GetTitleCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("gettitle", client);
    }

    public OnInfo(data: string[])
    {
        let base64 = data.join(" ");
        this.Client.SetTitle(base64);
    }

    public OnError(code: number, error: string)
    {
        
    }
    
}