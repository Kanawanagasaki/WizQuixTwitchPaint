class WebClient
{
    private _uri:string;
    private _socket:WebSocket;

    public IsAuthorized:boolean;
    public IsConnected:boolean;
    private _auth:Twitch.ext.Authorized;
    private _jwt:any;

    private _commands:Commands;

    public Canvas:Canvas;

    public Background:string;
    public Title:string;

    public Interval:number = 2500;

    public OnBackgroundChanged:()=>any = undefined;
    public OnTitleChanged:()=>any = undefined;
    public OnConnected:()=>any = undefined;
    public OnMissingRoom:()=>any = undefined;
    public OnKick:(reasong:string)=>any = undefined;
    public OnDisconnected:()=>any = undefined;

    public constructor(uri:string, canvas:Canvas)
    {
        this._uri = uri;
        this._commands = new Commands(this);
        this.Canvas = canvas;
        Twitch.ext.onAuthorized((auth:Twitch.ext.Authorized)=>
        {
            this.OnAuth(auth);
        });

        this.StartTimer(()=>this.ProcessHistory());
    }

    private StartTimer(func:()=>any)
    {
        setTimeout(()=>
        {
            func();
            this.StartTimer(func);
        }, this.Interval);
    }

    public SetBackground(bg:string)
    {
        this.Background = bg;
        if(this.OnBackgroundChanged !== undefined)
            this.OnBackgroundChanged();
    }

    public SetTitle(title:string)
    {
        this.Title = title;
        if(this.OnTitleChanged !== undefined)
            this.OnTitleChanged();
    }

    private OnAuth(auth:Twitch.ext.Authorized)
    {
        this.IsAuthorized = true;
        this._auth = auth;
        this.Open();
    }

    private ProcessHistory()
    {
        if(this.IsConnected && this.Canvas.History.length > 0)
        {
            let item = this.Canvas.History.shift();
            this.SendMessage(`setpixel ${this.Canvas.GetVerticalCoord(item.X)}${item.Y+1} ${item.Color.Name}`);
        }
    }

    public SendMessage(message:string)
    {
        if(this.IsConnected)
        {
            this._socket.send(`${message}\n`);
        }
    }

    public Connected()
    {
        if(this.OnConnected !== undefined)
            this.OnConnected();
        
        this.SendMessage("getbackground");
        this.SendMessage("gettitle");
        this.SendMessage("getcolors");
        this.SendMessage("getcanvas");
        this.SendMessage("getinterval");
    }

    public MissingRoom()
    {
        if(this.OnMissingRoom !== undefined)
            this.OnMissingRoom();
    }

    public Kicked(reason:string)
    {
        if(this.OnKick !== undefined)
            this.OnKick(reason);
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
        this._jwt = this.ParseJwt(this._auth.token);
        console.log({auth:this._auth, jwt:this._jwt});
        this.TryJoinRoom();
    }

    public TryJoinRoom()
    {
        if(this.IsConnected && this._jwt.user_id !== undefined)
        {
            this.SendMessage(`joinroom ${this._auth.channelId} ${this._jwt.user_id}`);
        }
    }

    private OnMessage(message:MessageEvent<any>)
    {
        if(typeof(message.data) === "string")
        {
            let commands = message.data.split("\n").filter(c=>c!=="");
            for(let i = 0; i < commands.length; i++)
            {
                this._commands.Execute(commands[i]);
            }
        }
    }

    private OnClose(event:CloseEvent)
    {
        this.IsConnected = false;
        if(this.OnDisconnected !== undefined)
            this.OnDisconnected();
    }

    private OnError(error:Event)
    {
        if(this.IsConnected) this._socket.close();
        this.IsConnected = false;
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
}