class App
{
    public static Size:number = 600;
    public static Percent:number = 0.75;
    public static XPos:number = 100;
    public static YPos:number = 10;

    private _placeholder:HTMLElement;
    private _palettePlaceholder:HTMLElement;
    private _canvasPlaceholder:HTMLElement;
    private _titlePlaceholder:HTMLElement;
    private _statusPlaceholder:HTMLElement;
    private _iconStatusPlaceholder:HTMLElement;
    private _iconImg:HTMLImageElement;

    private _palettePanel:PalettePanel;
    private _canvasPanel:CanvasPanel;

    private _canvas:Canvas;
    private _palette:Palette;
    private _client:WebClient;

    private _animationInterval = undefined;
    private _loadedData:number = 0;
    private _isDead:boolean = false;

    private _uri:string;

    public constructor(placeholder:HTMLElement, uri:string)
    {
        this._placeholder = placeholder;
        this._uri = uri;

        this._placeholder.style.backgroundColor = "black";
        this._placeholder.style.position = "absolute";
        this._placeholder.style.top = `calc(${App.YPos}% - ${App.YPos}px)`;
        this._placeholder.style.left = `calc(${App.XPos}% - ${App.XPos}px)`;
        this._placeholder.style.width = "100px";
        this._placeholder.style.height = "100px";
        this._placeholder.style.borderRadius = "5px";
        this._placeholder.style.backgroundRepeat = "repeat";
        this._placeholder.style.backgroundSize = "contain";
        this._placeholder.style.backgroundPosition = "center";

        this._statusPlaceholder = document.createElement("div");
        this._statusPlaceholder.style.position = "absolute";
        this._statusPlaceholder.style.left = "0px";
        this._statusPlaceholder.style.top = "0px";
        this._statusPlaceholder.style.right = "0px";
        this._statusPlaceholder.style.bottom = "0px";
        this._statusPlaceholder.style.padding = "20px";
        this._statusPlaceholder.style.color = "white";
        this._statusPlaceholder.style.fontSize = "48px";
        this._statusPlaceholder.style.display = "flex";
        this._statusPlaceholder.style.justifyContent = "center";
        this._statusPlaceholder.style.alignItems = "center";
        this._statusPlaceholder.style.textAlign = "center";
        this._statusPlaceholder.style.display = "none";
        this._statusPlaceholder.innerText = "Waiting for authorization...";

        this._iconImg = document.createElement("img");
        this._iconImg.style.width = "100%";
        this._iconImg.style.height = "100%";
        this._iconImg.src = "loading.gif";

        this._iconStatusPlaceholder = document.createElement("div");
        this._iconStatusPlaceholder.style.position = "absolute";
        this._iconStatusPlaceholder.style.left = "0px";
        this._iconStatusPlaceholder.style.top = "0px";
        this._iconStatusPlaceholder.style.right = "0px";
        this._iconStatusPlaceholder.style.bottom = "0px";
        this._iconStatusPlaceholder.style.padding = "20px";
        this._iconStatusPlaceholder.style.display = "flex";
        this._iconStatusPlaceholder.style.justifyContent = "center";
        this._iconStatusPlaceholder.style.alignItems = "center";
        this._iconStatusPlaceholder.style.textAlign = "center";
        this._iconStatusPlaceholder.append(this._iconImg);

        Twitch.ext.onAuthorized((auth)=>
        {
            this.OnAuth(auth);
        });
    }

    private ParseConfig()
    {
        let conf = Twitch.ext.configuration.broadcaster;
        if(conf !== undefined)
        {
            try
            {
                let obj = JSON.parse(conf.content);

                if("app_size" in obj) App.Size = obj.app_size;
                if("app_percent" in obj) App.Percent = obj.app_percent/100.0;
                if("app_xpos" in obj) App.XPos = obj.app_xpos;
                if("app_ypos" in obj) App.YPos = obj.app_ypos;

                if("fp_animationtime" in obj) FloatingPixel.AnimationTime = obj.fp_animationtime;
                if("fp_traveldistancestart" in obj) FloatingPixel.TravelDistanceStart = obj.fp_traveldistancestart;
                if("fp_traveldistance" in obj) FloatingPixel.TravelDistance = obj.fp_traveldistance;
                if("fp_rotationangle" in obj) FloatingPixel.RotationAngle = obj.fp_rotationangle * Math.PI / 180.0;
                if("fp_rotationtime" in obj) FloatingPixel.RotationTime = obj.fp_rotationtime;
                if("fp_sizemultiplier" in obj) FloatingPixel.SizeMultiplier = obj.fp_sizemultiplier;
            }
            catch(e){}
        }
    }

    private OnAuth(auth:Twitch.ext.Authorized)
    {
        this.ParseConfig();

        this._palette = new Palette();
        this._canvas = new Canvas(this._palette);
        this._client = new WebClient(this._uri, this._canvas, auth);

        this._palette.OnChange(()=>this.OnPaletteChanged());
        this._client.OnConnected = ()=>this.OnConnect();
        this._client.OnMissingRoom = ()=>this.OnMissingRoom();
        this._client.OnKick = (reasong:string)=>this.OnKick(reasong);
        this._client.OnDisconnected = ()=>this.OnDisconnect();
        this._client.OnBackgroundChanged = () => this.OnBackgroundChanged();
        this._client.OnTitleChanged = () => this.OnTitleChanged();

        this._statusPlaceholder.innerText = "Conencting to hub...";

        this._canvasPlaceholder = document.createElement("div");
        this._canvasPlaceholder.style.position = "absolute";
        this._canvasPlaceholder.style.left = "0px";
        this._canvasPlaceholder.style.bottom = "0px";
        this._canvasPlaceholder.style.width = "100%";
        this._canvasPlaceholder.style.height = "100%";
        this._canvasPlaceholder.style.cursor = "pointer";

        this._palettePlaceholder = document.createElement("div");
        this._palettePlaceholder.style.position = "absolute";
        this._palettePlaceholder.style.right = "0px";
        this._palettePlaceholder.style.top = "0px";
        this._palettePlaceholder.style.bottom = "0px";
        this._palettePlaceholder.style.width = Math.round((1-App.Percent) * 100) + "%";
        this._palettePlaceholder.style.display = "none";

        this._titlePlaceholder = document.createElement("div");
        this._titlePlaceholder.style.position = "absolute";
        this._titlePlaceholder.style.left = "0px";
        this._titlePlaceholder.style.top = "0px";
        this._titlePlaceholder.style.width = Math.round(App.Percent * 100) + "%";
        this._titlePlaceholder.style.height = Math.round((1-App.Percent) * 100) + "%";
        this._titlePlaceholder.style.backgroundRepeat = "no-repeat";
        this._titlePlaceholder.style.backgroundSize = "contain";
        this._titlePlaceholder.style.backgroundPosition = "left";
        this._titlePlaceholder.style.display = "none";

        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);

        this._palettePanel = new PalettePanel(this._palettePlaceholder, this._palette);
        this._canvasPanel = new CanvasPanel(this._canvasPlaceholder, this._canvas);

        document.body.onclick = (e)=>
        {
            let element = e.target as Element;
            if(element.closest("#app")) this.Maximalize();
            else this.Minimalize();
        }
    }

    private Minimalize()
    {
        if(this._placeholder.style.width != "100px")
        {
            this.Animate(0, 1, (op)=>
            {
                let size:number = App.Size - op * (App.Size - 100);
                this._placeholder.style.width = size + "px";
                this._placeholder.style.height = size + "px";
                this._placeholder.style.top = `calc(${App.YPos}% - ${size}px * ${App.YPos/100})`;
                this._placeholder.style.left = `calc(${App.XPos}% - ${size}px * ${App.XPos/100})`;

                let percent = App.Percent + op * (1 - App.Percent);
                this._canvasPlaceholder.style.width = Math.round(percent * 100) + "%";
                this._canvasPlaceholder.style.height = Math.round(percent * 100) + "%";

                if(op>0.9)
                {
                    this._titlePlaceholder.style.display = "none";
                    this._palettePlaceholder.style.display = "none";
                }
                if(op>0.5)
                {
                    this._statusPlaceholder.style.display = "none";
                    this._iconStatusPlaceholder.style.display = "flex";
                }

                this._canvasPanel.Maximized = size > 300;
            }, 100);
        }
    }

    private Maximalize()
    {
        if(this._placeholder.style.width != App.Size + "px")
        {
            this.Animate(1, 0, (op)=>
            {
                let size:number = App.Size - op * (App.Size - 100);
                this._placeholder.style.width = size + "px";
                this._placeholder.style.height = size + "px";
                this._placeholder.style.top = `calc(${App.YPos}% - ${size}px * ${App.YPos/100})`;
                this._placeholder.style.left = `calc(${App.XPos}% - ${size}px * ${App.XPos/100})`;

                let percent = App.Percent + op * (1 - App.Percent);
                this._canvasPlaceholder.style.width = Math.round(percent * 100) + "%";
                this._canvasPlaceholder.style.height = Math.round(percent * 100) + "%";

                if(op<0.9)
                {
                    this._titlePlaceholder.style.display = "";
                    this._palettePlaceholder.style.display = "";
                }
                if(op<0.5)
                {
                    this._statusPlaceholder.style.display = "flex";
                    this._iconStatusPlaceholder.style.display = "none";
                }

                this._canvasPanel.Maximized = size > 300;
            }, 100);
        }
    }

    private OnBackgroundChanged()
    {
        var img = new Image();
        img.src = this._client.Background;
        this._placeholder.style.backgroundImage = "url('" + img.src + "')";
        this.OnDataReceived(0b0001);
    }

    private OnTitleChanged()
    {
        var img = new Image();
        img.src = this._client.Title;
        this._titlePlaceholder.style.backgroundImage = "url('" + img.src + "')";
        this.OnDataReceived(0b0010);
    }

    private OnPaletteChanged()
    {
        this.OnDataReceived(0b0100);
    }

    private OnDataReceived(mask:number)
    {
        this._loadedData |= mask;
        if((this._loadedData & 0b0111) == 0b0111)
        {
            this._placeholder.innerHTML = "";

            this._placeholder.append(this._titlePlaceholder);
            this._placeholder.append(this._palettePlaceholder);
            this._placeholder.append(this._canvasPlaceholder);
        }
        else
        {
            let progress = 0;
            if((this._loadedData & 0b0001) > 0) progress++;
            if((this._loadedData & 0b0010) > 0) progress++;
            if((this._loadedData & 0b0100) > 0) progress++;

            this._statusPlaceholder.innerText = `Loading... ${progress}/3`;
        }
    }

    private OnConnect()
    {
        this._statusPlaceholder.innerText = `Loading... 0/3`;
    }

    private OnMissingRoom()
    {
        this._statusPlaceholder.innerText = `Room not found...\nBut we are looking for it`;
        setTimeout(()=>
        {
            this._client.TryJoinRoom();
        }, 2000);
    }

    private OnKick(reason:string)
    {
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);
        if(reason === "room_destroyed")
        {
            this._statusPlaceholder.innerText = "Room has been destroyed\nTrying to rejoin...";
            setTimeout(()=>
            {
                this._client.TryJoinRoom();
            }, 2000);
        }
        else
        {
            this._iconImg.src = "disconnected.png";
            reason = reason.trim();
            if(reason.length > 0)
                this._statusPlaceholder.innerText = "You has been kicked\nReason: " + reason;
            else
                this._statusPlaceholder.innerText = "You has been kicked";
        }
    }

    private OnDisconnect()
    {
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);
        this._statusPlaceholder.innerText = "Unable to establish connection to hub";
        this._isDead = true;
        setTimeout(()=>
        {
            let start = parseFloat(this._placeholder.style.opacity);
            if(isNaN(start)) start = 1;
            this.Animate(start, 0, (op)=>this._placeholder.style.opacity=op, 200);
        }, 2000);
        setTimeout(()=>
        {
            this._placeholder.innerHTML = "";
        }, 2200);
    }

    private Animate(start:number, finist:number, applyF:(number)=>any, time:number)
    {
        if(this._animationInterval !== undefined)
            clearInterval(this._animationInterval);

        let step = Math.abs((start - finist) / (time / 10));

        let current = start;
        this._animationInterval = setInterval(()=>
        {
            if(start > finist)
            {
                if(current > finist)
                    current -= step;
                else
                    clearInterval(this._animationInterval);
                applyF(Math.max(current, finist));
            }
            else
            {
                if(current < finist)
                    current += step;
                else
                    clearInterval(this._animationInterval);
                applyF(Math.min(current, finist));
            }
        }, 10);
    }
}