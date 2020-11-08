abstract class ACommand
{
    public Name:string;
    protected Client:WebClient;

    public constructor(name:string, client:WebClient)
    {
        this.Name = name.toLowerCase();
        this.Client = client;
    }

    public abstract OnInfo(data:string[]);
    public abstract OnError(code:number, error:string);
}