class PalettePanel
{
    private _placeholder:HTMLElement;
    private _paddingPlaceholder:HTMLElement;
    private _palette:Palette;

    public constructor(placeholder:HTMLElement, palette:Palette)
    {
        this._placeholder = placeholder;
        this._palette = palette;

        this._paddingPlaceholder = document.createElement("div");
        this._paddingPlaceholder.style.position = "absolute";
        this._paddingPlaceholder.style.overflowY = "auto";
        this._paddingPlaceholder.style.top = "0px";
        this._paddingPlaceholder.style.left = "0px";
        this._paddingPlaceholder.style.bottom = "0px";
        this._paddingPlaceholder.style.right = "-17px";
        this._paddingPlaceholder.style.color = "white";
        this._paddingPlaceholder.style.fontFamily = "monospace";
        this._paddingPlaceholder.style.fontSize = "12px";
        this._paddingPlaceholder.style.overflowY = "scroll";

        placeholder.append(this._paddingPlaceholder);

        this.DrawColors();

        palette.OnChange(()=>this.DrawColors());
    }

    private DrawColors()
    {
        this._paddingPlaceholder.innerHTML = "";
        for(let i = 0; i < this._palette.Colors.length; i++)
        {
            let colorDiv = document.createElement("div");
            colorDiv.style.position = "relative";
            colorDiv.style.width = "100%";
            colorDiv.style.height = "14px";
            colorDiv.style.cursor = "pointer";
            colorDiv.style.overflow = "clip";
            if(this._palette.SelectedColor === i)
                colorDiv.style.color = "yellow";

            let colorPreviewDiv = document.createElement("div");
            colorPreviewDiv.style.position = "absolute";
            colorPreviewDiv.style.top = "1px";
            colorPreviewDiv.style.left = "1px";
            colorPreviewDiv.style.bottom = "1px";
            colorPreviewDiv.style.width = "12px";
            colorPreviewDiv.style.backgroundColor = this._palette.Colors[i].Hex;
            
            let colorNameDiv = document.createElement("div");
            colorNameDiv.innerText = this._palette.Colors[i].Name;
            colorNameDiv.style.position = "absolute";
            colorNameDiv.style.top = "1px";
            colorNameDiv.style.left = "14px";
            colorNameDiv.style.bottom = "1px";
            colorNameDiv.style.right = "1px";

            colorDiv.append(colorPreviewDiv);
            colorDiv.append(colorNameDiv);

            colorDiv.onmouseenter = ()=>
            {
                colorDiv.style.color = "yellow";
            }
            colorDiv.onmouseleave = ()=>
            {
                if(this._palette.SelectedColor !== i)
                    colorDiv.style.color = "";
            }
            colorDiv.onclick = () =>
            {
                this._palette.SelectColor(i);
                for(let i = 0; i < this._paddingPlaceholder.children.length; i++)
                {
                    let item = this._paddingPlaceholder.children[i] as HTMLElement;
                    item.style.color = "";
                    item.style.fontWeight = "";
                }
                colorDiv.style.color = "yellow";
                colorDiv.style.fontWeight = "bold";
            }

            this._paddingPlaceholder.append(colorDiv);
        }
    }
}