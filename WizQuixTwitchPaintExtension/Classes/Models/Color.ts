class Color
{
    public Name:string;
    public RGB:number;
    public Hex:string;

    public constructor(name:string, rgb:number)
    {
        this.Name = name;
        this.RGB = rgb;
        this.Hex = this.ToHex(rgb);
    }

    public Update(rgb:number)
    {
        this.RGB = rgb;
        this.Hex = this.ToHex(rgb);
    }

    public ToHex(i)
    {
        let rrggbb =  ("000000" + i.toString(16)).slice(-6);
        //let rrggbb = bbggrr.substr(4, 2) + bbggrr.substr(2, 2) + bbggrr.substr(0, 2);
        return "#" + rrggbb;
    }
}