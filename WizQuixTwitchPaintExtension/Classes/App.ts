class App
{
    private _placeholder:HTMLElement;
    private _palettePlaceholder:HTMLElement;
    private _canvasPlaceholder:HTMLElement;
    private _titlePlaceholder:HTMLElement;
    private _statusPlaceholder:HTMLElement;

    private _palettePanel:PalettePanel;
    private _canvasPanel:CanvasPanel;

    private _canvas:Canvas;
    private _palette:Palette;
    private _client:WebClient;

    private _animationInterval = undefined;
    private _loadedData:number = 0;
    private _isDead:boolean = false;

    public constructor(placeholder:HTMLElement, uri:string)
    {
        this._palette = new Palette();
        this._canvas = new Canvas(this._palette);
        this._client = new WebClient(uri, this._canvas);

        this._palette.OnChange(()=>this.OnPaletteChanged());
        this._client.OnConnected = ()=>this.OnConnect();
        this._client.OnMissingRoom = ()=>this.OnMissingRoom();
        this._client.OnDisconnected = ()=>this.OnDisconnect();
        this._client.OnBackgroundChanged = () => this.OnBackgroundChanged();
        this._client.OnTitleChanged = () => this.OnTitleChanged();

        this._placeholder = placeholder;
        placeholder.style.backgroundColor = "black";
        placeholder.style.position = "absolute";
        placeholder.style.top = "10%";
        placeholder.style.right = "0px";
        placeholder.style.width = "600px";
        placeholder.style.height = "600px";
        placeholder.style.borderRadius = "5px";
        placeholder.style.backgroundRepeat = "repeat";
        placeholder.style.backgroundSize = "contain";
        placeholder.style.backgroundPosition = "center";
        placeholder.onmouseenter = ()=>
        {
            if(!this._isDead) this.AnimateOpasity(1, 150);
        };
        placeholder.onmouseleave = ()=>
        {
            if(!this._isDead) this.AnimateOpasity(0.2, 150);
        };

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
        this._statusPlaceholder.innerText = "Connecting to Hub...";

        this._palettePlaceholder = document.createElement("div");
        this._palettePlaceholder.style.position = "absolute";
        this._palettePlaceholder.style.right = "0px";
        this._palettePlaceholder.style.top = "0px";
        this._palettePlaceholder.style.bottom = "0px";
        this._palettePlaceholder.style.width = "25%";

        this._canvasPlaceholder = document.createElement("div");
        this._canvasPlaceholder.style.position = "absolute";
        this._canvasPlaceholder.style.left = "0px";
        this._canvasPlaceholder.style.bottom = "0px";
        this._canvasPlaceholder.style.width = "75%";
        this._canvasPlaceholder.style.height = "75%";

        this._titlePlaceholder = document.createElement("div");
        this._titlePlaceholder.style.position = "absolute";
        this._titlePlaceholder.style.left = "0px";
        this._titlePlaceholder.style.top = "0px";
        this._titlePlaceholder.style.width = "75%";
        this._titlePlaceholder.style.height = "25%";
        this._titlePlaceholder.style.backgroundRepeat = "no-repeat";
        this._titlePlaceholder.style.backgroundSize = "contain";
        this._titlePlaceholder.style.backgroundPosition = "left";

        this._placeholder.append(this._statusPlaceholder);

        this._palettePanel = new PalettePanel(this._palettePlaceholder, this._palette);
        this._canvasPanel = new CanvasPanel(this._canvasPlaceholder, this._canvas);
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
        this._statusPlaceholder.innerText = `Room didn't found`;
        setTimeout(()=>
        {
            this._client.TryJoinRoom();
        }, 2000);
    }

    private OnDisconnect()
    {
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._statusPlaceholder.innerText = "Unable to establish connection to hub";
        this._isDead = true;
        setTimeout(()=>
        {
            this.AnimateOpasity(0, 200);
        }, 2000);
        setTimeout(()=>
        {
            this._placeholder.innerHTML = "";
        }, 2200);
    }

    private AnimateOpasity(opacity:number, time:number)
    {
        if(this._animationInterval !== undefined)
            clearInterval(this._animationInterval);

        opacity = Math.max(0, opacity);
        opacity = Math.min(1, opacity);

        let start = parseFloat(this._placeholder.style.opacity);
        if(isNaN(start))
        {
            this._placeholder.style.opacity = '1';
            start = 1;
        }

        let step = Math.abs((start - opacity) / (time / 20));

        this._animationInterval = setInterval(()=>
        {
            let current = parseFloat(this._placeholder.style.opacity);
            if(start > opacity)
            {
                if(current > opacity)
                    current -= step;
                else
                    clearInterval(this._animationInterval);
                this._placeholder.style.opacity = `${Math.max(current, opacity)}`;
            }
            else
            {
                if(current < opacity)
                    current += step;
                else
                    clearInterval(this._animationInterval);
                this._placeholder.style.opacity = `${Math.min(current, opacity)}`;
            }
        }, 20);
    }
}