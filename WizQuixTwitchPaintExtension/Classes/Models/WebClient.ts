class WebClient
{
    private _uri:string;
    private _socket:WebSocket;

    public IsAuthorized:boolean;
    public IsConnected:boolean;
    private _auth:Twitch.ext.Authorized;

    private _commands:Commands;

    public Canvas:Canvas;

    public Background:string;
    public Title:string;

    private _eventBackgroundChanged:any[] = [];
    private _eventTitleChanged:any[] = [];

    public constructor(uri:string, canvas:Canvas)
    {
        this._uri = uri;
        this._commands = new Commands(this);
        this.Canvas = canvas;
        Twitch.ext.onAuthorized((auth:Twitch.ext.Authorized)=>
        {
            this.OnAuth(auth);
        });
        setInterval(()=>this.ProcessHistory(), 1000);
    }

    public SetBackground(bg:string)
    {
        this.Background = bg;
        this.BackgraundChanged();
    }

    public SetTitle(title:string)
    {
        this.Title = title;
        this.TitleChanged();
    }

    private OnAuth(auth:Twitch.ext.Authorized)
    {
        this.IsAuthorized = true;
        this._auth = auth;
        this.Open();
    }

    private ProcessHistory()
    {
        if(this.Canvas.History.length > 0)
        {
            let item = this.Canvas.History.shift();
            this.SendMessage(`setpixel ${this.Canvas.GetVerticalCoord(item.X)}${item.Y+1} ${item.Color.Name}`);
        }
    }

    public SendMessage(message:string)
    {
        if(this.IsConnected)
        {
            this._socket.send(`${message}\0`);
        }
    }

    public Init()
    {
        this.SendMessage("getbackground");
        this.SendMessage("gettitle");
        this.SendMessage("getcolors");
        this.SendMessage("getcanvas");
    }

    public Open()
    {
        if(this.IsAuthorized)
        {
            this._socket = new WebSocket(this._uri);
    
            this._socket.onopen = (e)=>{this.OnOpen(e)};
            this._socket.onmessage = (e)=>{this.OnMessage(e)};
            this._socket.onclose = (e)=>{this.OnClose(e)};
            this._socket.onerror = (e)=>{this.OnError(e)};
        }
    }

    public Close()
    {
        this._socket.close(1000, "");
        this.IsConnected = false;
    }

    private OnOpen(event:Event)
    {
        this.IsConnected = true;
        let jwt = this.ParseJwt(this._auth.token);
        this.SendMessage(`setme viewer ${this._auth.channelId} ${jwt.user_id}`);
    }

    private OnMessage(message:MessageEvent<any>)
    {
        if(typeof(message.data) === "string")
        {
            let commands = message.data.split("\0").filter(c=>c!=="");
            for(let i = 0; i < commands.length; i++)
            {
                this._commands.Execute(commands[i]);
            }
        }
    }

    private OnClose(event:CloseEvent)
    {
        this.IsConnected = false;
    }

    private OnError(error:Event)
    {
        
    }

    private ParseJwt (token)
    {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    private BackgraundChanged()
    {
        for(let i = 0; i < this._eventBackgroundChanged.length; i++)
        {
            this._eventBackgroundChanged[i]();
        }
    }

    public OnBackgroundChanged(func:()=>any)
    {
        this._eventBackgroundChanged.push(func);
    }

    private TitleChanged()
    {
        for(let i = 0; i < this._eventTitleChanged.length; i++)
        {
            this._eventTitleChanged[i]();
        }
    }

    public OnTitleChanged(func:()=>any)
    {
        this._eventTitleChanged.push(func);
    }
}