class SelectConfigOption extends AConfigOption
{
    private _el:HTMLSelectElement;
    private _options:{name:string, text:string}[];

    public constructor(name:string, text:string, options:{name:string, text:string}[])
    {
        super(name, text, ConfigOptionTypes.Select);
        this._options = options;

        this._el = document.createElement("select");
        for(let i = 0; i < this._options.length; i++)
        {
            let opt = document.createElement("option");
            opt.value = this._options[i].name;
            opt.innerText = this._options[i].text;
            this._el.append(opt);
        }
        this._el.className = "form-control";
    }

    public GetElement(): HTMLElement
    {
        return this._el;
    }

    public GetValue()
    {
        return this._el.value;
    }
    public IsValueValid(): boolean
    {
        return true;
    }
    public GetErrorText(): string
    {
        return "";
    }
    
}