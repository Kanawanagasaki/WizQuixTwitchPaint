class IntConfigOption extends NumberConfigOption
{
    public constructor(name:string, text:string)
    {
        super(name, text, ConfigOptionTypes.Int);
    }

    public GetValue()
    {
        let str = super.GetValue();
        let ret = parseInt(str);
        if(this._isStepSetted)
            return ret - ret % this._step;
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