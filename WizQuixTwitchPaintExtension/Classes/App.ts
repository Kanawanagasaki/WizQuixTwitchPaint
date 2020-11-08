class App
{
    private _placeholder:HTMLElement;
    private _palettePlaceholder:HTMLElement;
    private _canvasPlaceholder:HTMLElement;
    private _titlePlaceholder:HTMLElement;

    private _palettePanel:PalettePanel;
    private _canvasPanel:CanvasPanel;

    private _canvas:Canvas;
    private _palette:Palette;
    private _client:WebClient;

    public constructor(placeholder:HTMLElement, uri:string)
    {
        this._palette = new Palette();
        this._canvas = new Canvas(this._palette);
        this._client = new WebClient(uri, this._canvas);

        this._client.OnBackgroundChanged(()=>this.OnBackgroundChanged());
        this._client.OnTitleChanged(()=>this.OnTitleChanged());

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

        placeholder.append(this._palettePlaceholder);
        placeholder.append(this._canvasPlaceholder);
        placeholder.append(this._titlePlaceholder);

        this._palettePanel = new PalettePanel(this._palettePlaceholder, this._palette);
        this._canvasPanel = new CanvasPanel(this._canvasPlaceholder, this._canvas);
    }

    private OnBackgroundChanged()
    {
        this._placeholder.style.backgroundImage = `url('${this._client.Background}')`;
    }

    private OnTitleChanged()
    {
        this._titlePlaceholder.style.backgroundImage = `url('${this._client.Title}')`;
    }
}