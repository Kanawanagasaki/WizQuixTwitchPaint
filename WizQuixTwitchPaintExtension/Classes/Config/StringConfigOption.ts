class StringConfigOption extends AConfigOption
{
    private _el:HTMLInputElement;

    private _isMinSetted:boolean = false;
    private _minLength:number;

    private _isMaxSetted:boolean = false;
    private _maxLength:number;

    public constructor(name:string, text:string)
    {
        super(name, text, ConfigOptionTypes.String);
        
        this._el = document.createElement("input");
        this._el.placeholder = this.Text;
        this._el.type = "text";
        this._el.className = "form-control";
    }

    public SetMinLength(minLen:number):StringConfigOption
    {
        this._isMinSetted = true;
        this._minLength = minLen;
        this._el.minLength = minLen;
        return this;
    }

    public SetMaxLength(maxLen:number):StringConfigOption
    {
        this._isMaxSetted = true;
        this._maxLength = maxLen;
        this._el.maxLength = maxLen;
        return this;
    }

    public GetElement(value:any):HTMLElement
    {
        if(value !== undefined)
            this._el.value = value;
        else this._el.value = this.Default;
        return this._el;
    }

    public GetValue()
    {
        return this._el.value;
    }

    public IsValueValid(): boolean
    {
        let val = this.GetValue();
        if(this._isMinSetted && val.length < this._minLength) return false;
        if(this._isMaxSetted && val.length > this._maxLength) return false;
        return true;
    }

    public GetErrorText(): string
    {
        if(this._isMinSetted && this._isMaxSetted)
            return `'${this.Text}' must be more or equals ${this._minLength} and less or equals ${this._maxLength} characters`;
        if(this._isMinSetted && !this._isMaxSetted)
            return `'${this.Text}' must be more or equals ${this._minLength} characters`;
        if(!this._isMinSetted && this._isMaxSetted)
            return `'${this.Text}' must be and less or equals ${this._maxLength} characters`;
        return "";
    }
}