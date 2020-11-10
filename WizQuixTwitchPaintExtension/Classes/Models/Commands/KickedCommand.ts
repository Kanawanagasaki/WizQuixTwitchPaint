class KickedCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("kicked", client);
    }

    public OnInfo(data: string[])
    {
        this.Client.Kicked(data.join(" "));
    }

    public OnError(code: number, error: string)
    {
        
    }
}