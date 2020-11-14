class Config
{
    private _placeholder:HTMLElement;
    private _version:string;

    private _options = 
    [
        new IntConfigOption("app_size", "Size (px)").SetMin(300).SetMax(700).SetDefault(600),
        new IntConfigOption("app_percent", "Canvas Size Percent (%)").SetMin(0).SetMax(100).SetStep(1).SetDefault(75),
        new IntConfigOption("app_xpos", "X Pos (%)").SetMin(0).SetMax(100).SetDefault(100),
        new IntConfigOption("app_ypos", "Y Pos (%)").SetMin(0).SetMax(100).SetDefault(10),

        new IntConfigOption("fp_animationtime", "Pixel Animation Time (ms)").SetMin(0).SetMax(60_000).SetStep(1).SetDefault(1333),
        new FloatConfigOption("fp_traveldistancestart", "Pixel Travel Start (unit)").SetMin(-100).SetMax(100).SetStep(0.01).SetDefault(0.5),
        new FloatConfigOption("fp_traveldistance", "Pixel Travel Distance (unit)").SetMin(-100).SetMax(100).SetStep(0.01).SetDefault(1.5),
        new FloatConfigOption("fp_rotationangle", "Pixel Rotation Angle (deg)").SetMin(-360).SetMax(360).SetStep(0.01).SetDefault(1.5),
        new IntConfigOption("fp_rotationtime", "Pixel Rotation Time (ms)").SetMin(0).SetMax(60_000).SetStep(1).SetDefault(2000),
        new FloatConfigOption("fp_sizemultiplier", "Pixel Size Multiplier").SetMin(0).SetMax(100).SetStep(0.01).SetDefault(1.1)
    ];

    public constructor(placeholder:HTMLElement, version:string)
    {
        this._placeholder = placeholder;
        this._version = version;
        
        this._placeholder.className = "p-4 bg-white";

        let errorDiv = document.createElement("div");
        errorDiv.style.display = "none";
        errorDiv.className = "bg-danger text-light m-1 p-3 rounded";
        this._placeholder.append(errorDiv);

        let table = document.createElement("table");
        table.style.width = "100%";
        this._placeholder.append(table);

        Twitch.ext.onAuthorized((auth)=>
        {
            let save:{} = {};
            if(Twitch.ext.configuration.broadcaster !== undefined)
                try
                {
                    save = JSON.parse(Twitch.ext.configuration.broadcaster.content);
                }catch(e){}

            for(let i = 0; i < this._options.length; i++)
            {
                let tr = document.createElement("tr");
                let td0 = document.createElement("td");
                let td1 = document.createElement("td");

                td0.innerText = this._options[i].Text;
                td0.style.padding = "8px";

                let el = this._options[i].GetElement(save[this._options[i].Name]);
                el.style.width = "100%";
                td1.style.padding = "8px";
                td1.append(el);

                tr.append(td0);
                tr.append(td1);
                table.append(tr);
            }

            let btn = document.createElement("button");
            btn.style.backgroundColor = "#6441A4";
            btn.className = "btn text-white";
            btn.innerText = "Save";
            btn.onclick = ()=>
            {
                let save = {};
                let hasInvalid:boolean = false;
                let errorText = "";
                for(let i = 0; i < this._options.length; i++)
                {
                    if(!this._options[i].IsValueValid())
                    {
                        hasInvalid = true;
                        errorText += this._options[i].GetErrorText() + "\n";
                    }
                    save[this._options[i].Name] = this._options[i].GetValue();
                }
                
                if(hasInvalid)
                {
                    errorDiv.style.display = "";
                    errorDiv.innerText = errorText;
                }
                else
                {
                    errorDiv.style.display = "none";
                    errorDiv.innerText = errorText;

                    console.log(save);
    
                    Twitch.ext.configuration.set("broadcaster", this._version, JSON.stringify(save));
                }
            }
            this._placeholder.append(btn);
        });
    }
}