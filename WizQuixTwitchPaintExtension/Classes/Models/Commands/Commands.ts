class Commands
{
    private _commands:ACommand[];

    public constructor(client:WebClient)
    {
        this._commands = [];
        this._commands.push(new ClearPaletteCommand(client));
        this._commands.push(new GetBackgroundCommand(client));
        this._commands.push(new GetCanvasCommand(client));
        this._commands.push(new GetColorsCommand(client));
        this._commands.push(new GetIntervalCommand(client));
        this._commands.push(new GetTitleCommand(client));
        this._commands.push(new JoinRoomCommand(client));
        this._commands.push(new KickedCommand(client));
        this._commands.push(new SetBackgroundCommand(client));
        this._commands.push(new SetColorCommand(client));
        this._commands.push(new SetIntervalCommand(client));
        this._commands.push(new SetPixelCommand(client));
        this._commands.push(new SetTitleCommand(client));
    }

    public Execute(str:string)
    {
        let parts = str.split(' ');
        if(parts.length < 2) return;
        let filter = this._commands.filter(c=>c.Name == parts[1]);
        if(filter.length != 1) return;

        let command = filter[0];

        if(parts[0] == "info")
        {
            command.OnInfo(parts.slice(2));
        }
        else if(parts[0] == "error")
        {
            let code = parseInt(parts[2]);
            let message = parts.slice(3).join(" ");
            command.OnError(code, message);
        }
    }
}