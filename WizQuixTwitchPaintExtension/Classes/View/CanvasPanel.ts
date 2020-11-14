class CanvasPanel
{
    private _placehloder:HTMLElement;
    private _canvas:Canvas;
    private _htmlCanvas:HTMLCanvasElement;
    private _context:CanvasRenderingContext2D;

    private _width:number;
    private _height:number;
    private _padding:number = 4;

    private _mouseX:number = -1;
    private _mouseY:number = -1;
    private _isMouseDown:boolean = false;

    public Maximized:boolean = false;

    public constructor(placeholder:HTMLElement, canvas:Canvas)
    {
        this._placehloder = placeholder;
        this._canvas = canvas;

        this._width = Math.round(App.Size * App.Percent);
        this._height = Math.round(App.Size * App.Percent);

        this._htmlCanvas = document.createElement("canvas");
        this._htmlCanvas.style.width = "100%";
        this._htmlCanvas.style.height = "100%";
        this._htmlCanvas.width = this._width;
        this._htmlCanvas.height = this._height;

        this._htmlCanvas.onmousemove = (evt)=>this.OnMouseMove(evt);
        this._htmlCanvas.onmouseleave = (evt)=>this.OnMouseLeave(evt);
        this._htmlCanvas.onmousedown = (evt)=>this.OnMouseDown(evt);
        this._htmlCanvas.onmouseup = (evt)=>this.OnMouseUp(evt);

        placeholder.append(this._htmlCanvas);

        this._context = this._htmlCanvas.getContext("2d");

        this.Draw();

        setInterval(()=>this.Draw(), 20);
    }

    private Draw()
    {
        this._context.clearRect(0, 0, this._width, this._height);

        let w = this._width - this._padding * 2;
        let h = this._height - this._padding * 2;

        let itemW = w / (Canvas.Width + (this.Maximized?1:0));
        let itemH = h / (Canvas.Height + (this.Maximized?1:0));

        for(let iy = 0; iy < Canvas.Height; iy++)
        {
            for(let ix = 0; ix < Canvas.Width; ix++)
            {
                if(this.Maximized && this._mouseX == ix && this._mouseY == iy)
                    this._context.fillStyle = this._canvas.Palette.GetSelectedColor().Hex;
                else
                    this._context.fillStyle = this._canvas.GetPixel(ix, iy).Hex;

                let x = this._padding + (this.Maximized ? itemW : 0) + ix * itemW;
                let y = this._padding + iy * itemH;
                this._context.fillRect(x-1, y-1, itemW+1, itemH+1);
            }
        }

        try
        {
            this._context.lineWidth = 1;
            this._context.textAlign = "center";
            this._context.textBaseline = "middle";
            this._context.font = "normal 12px monospace";
            this._context.fillStyle = "#FFFFFF";
        }
        catch(ex) {}

        if(this.Maximized)
        {
            for(let i = 0; i < Canvas.Height; i++)
            {
                let x = itemW * 0.5 + 2;
                let y = i * itemH + itemH * 0.5 + 5;
    
                let text = `${i+1}`;
                try
                {
                    this._context.fillText(text, x, y);
                }
                catch(ex) {}
            }
    
            for(let i = 0; i < Canvas.Width; i++)
            {
                let x = itemW * 1.5 + i * itemW + 3;
                let y = Canvas.Height * itemH + itemH * 0.5 + 5;
    
                let text = this._canvas.GetVerticalCoord(i);
                try
                {
                    this._context.fillText(text, x, y);
                }
                catch(ex) {}
            }
        }

        this._context.lineWidth = 2;

        this._context.strokeStyle = "#FFFFFF";
        this._context.strokeRect(this._padding + (this.Maximized?itemW:0), this._padding, w - (this.Maximized?itemW:0), h - (this.Maximized?itemW:0));

        if(this.Maximized &&
            this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height)
        {
            this._context.strokeStyle = "#FFFF33";
            this._context.strokeRect(this._padding + itemW + this._mouseX * itemW, this._padding + this._mouseY * itemH, itemW, itemH);
        }

        for( var i = 0; i < this._canvas.FloatingPixels.length; i++)
        {
            if (this._canvas.FloatingPixels[i].IsEnded())
            {
                this._canvas.FloatingPixels.splice(i, 1);
                i--;
            }
            else if(this.Maximized)
            {
                let fpx = this._padding + itemW + this._canvas.FloatingPixels[i].X * itemW;
                let fpy = this._padding + this._canvas.FloatingPixels[i].Y * itemH;
                this._canvas.FloatingPixels[i].Draw(this._context, fpx, fpy, itemW, itemH);
            }
        }
    }

    private OnMouseMove(evt)
    {
        if(!this.Maximized) return;

        this.CalculateMouseCoord(evt);
        if(this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height &&
            this._isMouseDown)
        {
            this._canvas.DrawPixel(this._mouseX, this._mouseY);
        }
    }

    private OnMouseLeave(evt)
    {
        this._mouseX = -1;
        this._mouseY = -1;
        this._isMouseDown = false;
    }

    private OnMouseDown(evt)
    {
        if(!this.Maximized) return;

        this.CalculateMouseCoord(evt);
        this._isMouseDown = true;
        if(this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height &&
            this._isMouseDown)
        {
            this._canvas.DrawPixel(this._mouseX, this._mouseY);
        }
    }

    private OnMouseUp(evt)
    {
        this._isMouseDown = false;
    }

    private CalculateMouseCoord(evt)
    {
        let mousePos = this.GetMousePos(this._htmlCanvas, evt);
        
        let w = this._width - this._padding * 2;
        let h = this._height - this._padding * 2;
        let x = mousePos.x - this._padding;
        let y = mousePos.y - this._padding;

        this._mouseX = Math.floor(x / w * (Canvas.Width + 1)) - 1;
        this._mouseY = Math.floor(y / h * (Canvas.Height + 1));
    }

    private GetMousePos(canvas:HTMLCanvasElement, evt)
    {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
      
        return {
          x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }
}