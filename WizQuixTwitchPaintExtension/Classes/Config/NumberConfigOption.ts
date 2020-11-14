abstract class NumberConfigOption extends AConfigOption
{
    protected _el:HTMLInputElement;

    protected _isMinSetted:boolean;
    protected _min:number;

    protected _isMaxSetted:boolean;
    protected _max:number;

    protected _isStepSetted:boolean;
    protected _step:number;

    public constructor(name:string, text:string, type:ConfigOptionTypes)
    {
        super(name, text, type);
        
        this._el = document.createElement("input");
        this._el.placeholder = this.Text;
        this._el.type = "number";
        this._el.className = "form-control";
    }

    public SetMin(min:number):NumberConfigOption
    {
        this._isMinSetted = true;
        this._min = min;
        this._el.min = min.toString();
        return this;
    }

    public SetMax(max:number):NumberConfigOption
    {
        this._isMaxSetted = true;
        this._max = max;
        this._el.max = max.toString();
        return this;
    }
    
    public SetStep(step:number):NumberConfigOption
    {
        this._isStepSetted = true;
        this._step = step;
        this._el.step = step.toString();
        return this;
    }

    public GetElement(value:any): HTMLElement
    {
        if(value !== undefined)
            this._el.value = value;
        else this._el.value = this.Default;
        return this._el;
    }

    public GetValue() : any
    {
        return this._el.value;
    }

    public GetErrorText(): string
    {
        if(this._isMinSetted && this._isMaxSetted)
            return `'${this.Text}' must be more or equals ${this._min} and less or equals ${this._max}`;
        if(this._isMinSetted && !this._isMaxSetted)
            return `'${this.Text}' must be more or equals ${this._min}`;
        if(!this._isMinSetted && this._isMaxSetted)
            return `'${this.Text}' must be and less or equals ${this._max}`;
        return "";
    }
}