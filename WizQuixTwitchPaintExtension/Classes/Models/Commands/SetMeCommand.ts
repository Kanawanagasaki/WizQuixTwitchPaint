class SetMeCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("setme", client);
    }

    public OnInfo(data: string[])
    {
        this.Client.Init();
    }

    public OnError(code: number, error: string)
    {
        this.Client.Close();
    }
}