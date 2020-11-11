class FloatingPixel
{
    static AnimationTime = 1333;
    static TravelDistanceStart = 0.5;
    static TravelDistance = 1.5;
    static RotationAngle = 0.025 * Math.PI;
    static RotationTime = 2000;
    static SizeMultiplier = 1.1;

    public X:number;
    public Y:number;
    public Color:Color;
    public Username:string;

    private _startTime:number;
    private _xDist:number;
    private _yDist:number;

    public constructor()
    {
        this._startTime = Date.now();

        let angle = Math.random() * 2 * Math.PI;
        let dist = FloatingPixel.TravelDistanceStart + Math.random() * FloatingPixel.TravelDistance;

        this._xDist = Math.cos(angle) * dist;
        this._yDist = Math.sin(angle) * dist;
    }

    public Draw(g:CanvasRenderingContext2D, x:number, y:number, w:number, h:number)
    {
        x += this.Progress() * this._xDist * w + w/2;
        y += this.Progress() * this._yDist * h + h/2;

        w *= FloatingPixel.SizeMultiplier;
        h *= FloatingPixel.SizeMultiplier;

        let rotation = this.Rotation();

        g.save();

        g.globalAlpha = this.Opacity();
        g.translate(x, y);
        g.rotate(rotation*Math.PI);

        g.fillStyle = this.Color.Hex;
        g.fillRect(-w/2, -h/2, w, h);
        g.strokeStyle = "#000000";
        g.strokeRect(-w/2, -h/2, w, h);
        g.strokeStyle = "#FFFFFF";
        g.strokeRect(-(w-2)/2, -(h-2)/2, w-2, h-2);

        g.restore();
    }

    public Rotation()
    {
        let time = Date.now() % FloatingPixel.RotationTime;
        let progress = time / FloatingPixel.RotationTime;
        let sin = Math.sin(2 * Math.PI * progress);
        return FloatingPixel.RotationAngle * sin;
    }

    public Opacity()
    {
        return Math.min(1, 2.5*(1-this.Progress()));
    }

    public IsEnded()
    {
        return this.Progress() === 0;
    }

    public Progress()
    {
        let now = Date.now();
        if(now - this._startTime > FloatingPixel.AnimationTime) return 0;
        else return (now - this._startTime) / FloatingPixel.AnimationTime;
    }
}