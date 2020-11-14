class JoinRoomCommand extends ACommand
{
    public constructor(client:WebClient)
    {
        super("joinroom", client);
    }

    public OnInfo(data: string[])
    {
        this.Client.Connected();
    }

    public OnError(code: number, error: string)
    {
        if(code === 404)
        {
            if(this.Client.OnMissingRoom)
                this.Client.OnMissingRoom();
        }
    }
}