class Canvas
{
    public static Width:number = 16;
    public static Height:number = 16;
    public static Letters:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public History:HistoryItem[] = [];

    private _canvas:Color[][];

    public Palette:Palette;

    public constructor(palette:Palette)
    {
        this.Palette = palette;

        this._canvas = [];
        for(let iy = 0; iy < Canvas.Height; iy++)
        {
            this._canvas.push([]);
            for(let ix = 0; ix < Canvas.Width; ix++)
            {
                this._canvas[iy][ix] = Palette.NullColor;
            }
        }
    }

    public DrawPixel(x:number, y:number)
    {
        let color = this.Palette.GetSelectedColor();
        this.SetPixel(x, y, color);
    }

    public SetPixel(x:number, y:number, color:Color, ignoreHistory:boolean = false)
    {
        if(x < 0 || x >= Canvas.Width) return;
        if(y < 0 || y >= Canvas.Height) return;

        if(this._canvas[y][x] !== color)
        {
            this._canvas[y][x] = color;
            if(!ignoreHistory)
            {
                this.History.push(new HistoryItem(x, y, color));
            }
        }
    }

    public GetPixel(x: number, y: number)
    {
        if(x < 0 || x >= Canvas.Width) return Palette.NullColor;
        if(y < 0 || y >= Canvas.Height) return Palette.NullColor;

        return this._canvas[y][x];
    }

    public ParceCanvas(data:string)
    {
        let split:string[] = data.split(";");
        for(let i = 0; i < split.length; i++)
        {
            let kv:string[] = split[i].split("=");
            if(kv.length != 2) continue;
            let coordsStr = kv[0];
            let colorname = kv[1];

            let coords = this.ParseCoordinate(coordsStr);
            if(coords === undefined) continue;
            
            let color = this.Palette.GetColorByName(colorname);
            if(color === undefined) continue;

            this.SetPixel(coords.x, coords.y, color, true);
        }
    }

    public ClearCanvas()
    {
        for(let iy = 0; iy < Canvas.Height; iy++)
        {
            for(let ix = 0; ix < Canvas.Width; ix++)
            {
                this._canvas[iy][ix] = Palette.NullColor;
            }
        }
    }

    public ParseCoordinate(str:string) : {x:number, y:number}
    {
        str = str.toUpperCase();
        if(str.length > 8) return undefined;

        let charCoordIndex = -1;
        for(let i = str.length - 1; i >= 0; i--)
        {
            if(charCoordIndex < 0)
            {
                if(Canvas.Letters.indexOf(str[i]) >= 0)
                {
                    charCoordIndex = i;
                }
            }
            else
            {
                if(Canvas.Letters.indexOf(str[i]) < 0)
                {
                    return undefined;
                }
            }
        }

        if(charCoordIndex < 0) return undefined;

        charCoordIndex++;
        let charCoord = str.substring(0, charCoordIndex);
        let numberCoord = str.substring(charCoordIndex);

        if(charCoord.length == 0) return undefined;
        if(numberCoord.length == 0) return undefined;

        let x = 0;
        for(let i = 0; i < charCoord.length; i++)
        {
            let index = Canvas.Letters.indexOf(charCoord[i]) + 1;
            let exp = charCoord.length - i - 1;
            x += Math.pow(Canvas.Letters.length, exp) * index;
        }

        let y = parseInt(numberCoord);

        x--;
        y--;

        return {x:x,y:y};
    }

    public GetVerticalCoord(y:number)
    {
        return Canvas.Letters[y % Canvas.Letters.length];
    }
}