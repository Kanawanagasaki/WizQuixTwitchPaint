class FloatConfigOption extends NumberConfigOption
{
    public constructor(name:string, text:string)
    {
        super(name, text, ConfigOptionTypes.Float);
    }

    public GetValue()
    {
        let str = super.GetValue();
        let ret = parseFloat(str);
        if(this._isStepSetted)
            return Math.round(ret*100 - (ret*100) % (this._step*100))/100;
        else return ret;
    }

    public IsValueValid(): boolean
    {
        let val = this.GetValue() as number;
        if(isNaN(val)) return false;
        if(this._isMinSetted && val < this._min) return false;
        if(this._isMaxSetted && val > this._max) return false;
        return true;
    }
}