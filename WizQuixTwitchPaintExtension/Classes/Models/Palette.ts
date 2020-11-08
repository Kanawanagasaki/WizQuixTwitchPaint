class Palette
{
    public static NullColor:Color = new Color("null", 2105376);

    public SelectedColor:number = 0;

    public Colors:Color[] = [];

    private _onChangeFuncs = [];

    public GetSelectedColor()
    {
        if(this.SelectedColor < 0 || this.SelectedColor >= this.Colors.length)
            return Palette.NullColor;
        return this.Colors[this.SelectedColor];
    }

    public SelectColor(color:Color|number)
    {
        if(typeof(color) === "number")
        {
            if(color < 0 || color >= this.Colors.length)
                color = 0;
            this.SelectedColor = color;
        }
        else
        {
            let index = this.Colors.indexOf(color);
            if(index >= 0) this.SelectedColor = index;
            else this.SelectedColor = 0;
        }
    }

    public AddOrUpdateColor(name:string, rgb:number, triggerEvent:boolean = true)
    {
        let filter = this.Colors.filter((c)=>c.Name == name);
        if(filter.length > 0)
        {
            filter.forEach(i=>i.Update(rgb));
        }
        else
        {
            this.Colors.push(new Color(name, rgb));
        }

        if(triggerEvent) this.Changed();
    }

    public ParseColors(palette:string)
    {
        let split:string[] = palette.split(";");
        for(let i = 0; i < split.length; i++)
        {
            let kv:string[] = split[i].split("=");
            if(kv.length != 2) continue;
            let colorname:string = kv[0];
            let rgb:number = parseInt(kv[1]);
            if(isNaN(rgb)) continue;
            this.AddOrUpdateColor(colorname, rgb, false);
        }
        
        this.Changed();
    }

    public GetColorByName(name:string)
    {
        let filter = this.Colors.filter((c)=>c.Name.toLowerCase() == name.toLowerCase());
        if(filter.length > 0) return filter[0];
        else return undefined;
    }

    public ClearPalette()
    {
        this.Colors = [];
        this.Changed();
    }

    private Changed()
    {
        for(let i = 0; i < this._onChangeFuncs.length; i++)
        {
            this._onChangeFuncs[i]();
        }
    }

    public OnChange(func:()=>any)
    {
        this._onChangeFuncs.push(func);
    }
}