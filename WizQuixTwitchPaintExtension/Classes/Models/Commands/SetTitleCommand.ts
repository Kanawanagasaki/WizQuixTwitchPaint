class SetTitleCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("settitle", client);
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