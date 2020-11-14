var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App = (function () {
    function App(placeholder, uri) {
        var _this = this;
        this._animationInterval = undefined;
        this._loadedData = 0;
        this._isDead = false;
        this._placeholder = placeholder;
        this._uri = uri;
        this._placeholder.style.backgroundColor = "black";
        this._placeholder.style.position = "absolute";
        this._placeholder.style.top = "calc(" + App.YPos + "% - " + App.YPos + "px)";
        this._placeholder.style.left = "calc(" + App.XPos + "% - " + App.XPos + "px)";
        this._placeholder.style.width = "100px";
        this._placeholder.style.height = "100px";
        this._placeholder.style.borderRadius = "5px";
        this._placeholder.style.backgroundRepeat = "repeat";
        this._placeholder.style.backgroundSize = "contain";
        this._placeholder.style.backgroundPosition = "center";
        this._statusPlaceholder = document.createElement("div");
        this._statusPlaceholder.style.position = "absolute";
        this._statusPlaceholder.style.left = "0px";
        this._statusPlaceholder.style.top = "0px";
        this._statusPlaceholder.style.right = "0px";
        this._statusPlaceholder.style.bottom = "0px";
        this._statusPlaceholder.style.padding = "20px";
        this._statusPlaceholder.style.color = "white";
        this._statusPlaceholder.style.fontSize = "48px";
        this._statusPlaceholder.style.display = "flex";
        this._statusPlaceholder.style.justifyContent = "center";
        this._statusPlaceholder.style.alignItems = "center";
        this._statusPlaceholder.style.textAlign = "center";
        this._statusPlaceholder.style.display = "none";
        this._statusPlaceholder.innerText = "Waiting for authorization...";
        this._iconImg = document.createElement("img");
        this._iconImg.style.width = "100%";
        this._iconImg.style.height = "100%";
        this._iconImg.src = "loading.gif";
        this._iconStatusPlaceholder = document.createElement("div");
        this._iconStatusPlaceholder.style.position = "absolute";
        this._iconStatusPlaceholder.style.left = "0px";
        this._iconStatusPlaceholder.style.top = "0px";
        this._iconStatusPlaceholder.style.right = "0px";
        this._iconStatusPlaceholder.style.bottom = "0px";
        this._iconStatusPlaceholder.style.padding = "20px";
        this._iconStatusPlaceholder.style.display = "flex";
        this._iconStatusPlaceholder.style.justifyContent = "center";
        this._iconStatusPlaceholder.style.alignItems = "center";
        this._iconStatusPlaceholder.style.textAlign = "center";
        this._iconStatusPlaceholder.append(this._iconImg);
        Twitch.ext.onAuthorized(function (auth) {
            _this.OnAuth(auth);
        });
    }
    App.prototype.ParseConfig = function () {
        var conf = Twitch.ext.configuration.broadcaster;
        if (conf !== undefined) {
            try {
                var obj = JSON.parse(conf.content);
                if ("app_size" in obj)
                    App.Size = obj.app_size;
                if ("app_percent" in obj)
                    App.Percent = obj.app_percent / 100.0;
                if ("app_xpos" in obj)
                    App.XPos = obj.app_xpos;
                if ("app_ypos" in obj)
                    App.YPos = obj.app_ypos;
                if ("fp_animationtime" in obj)
                    FloatingPixel.AnimationTime = obj.fp_animationtime;
                if ("fp_traveldistancestart" in obj)
                    FloatingPixel.TravelDistanceStart = obj.fp_traveldistancestart;
                if ("fp_traveldistance" in obj)
                    FloatingPixel.TravelDistance = obj.fp_traveldistance;
                if ("fp_rotationangle" in obj)
                    FloatingPixel.RotationAngle = obj.fp_rotationangle * Math.PI / 180.0;
                if ("fp_rotationtime" in obj)
                    FloatingPixel.RotationTime = obj.fp_rotationtime;
                if ("fp_sizemultiplier" in obj)
                    FloatingPixel.SizeMultiplier = obj.fp_sizemultiplier;
            }
            catch (e) { }
        }
    };
    App.prototype.OnAuth = function (auth) {
        var _this = this;
        this.ParseConfig();
        this._palette = new Palette();
        this._canvas = new Canvas(this._palette);
        this._client = new WebClient(this._uri, this._canvas, auth);
        this._palette.OnChange(function () { return _this.OnPaletteChanged(); });
        this._client.OnConnected = function () { return _this.OnConnect(); };
        this._client.OnMissingRoom = function () { return _this.OnMissingRoom(); };
        this._client.OnKick = function (reasong) { return _this.OnKick(reasong); };
        this._client.OnDisconnected = function () { return _this.OnDisconnect(); };
        this._client.OnBackgroundChanged = function () { return _this.OnBackgroundChanged(); };
        this._client.OnTitleChanged = function () { return _this.OnTitleChanged(); };
        this._statusPlaceholder.innerText = "Conencting to hub...";
        this._canvasPlaceholder = document.createElement("div");
        this._canvasPlaceholder.style.position = "absolute";
        this._canvasPlaceholder.style.left = "0px";
        this._canvasPlaceholder.style.bottom = "0px";
        this._canvasPlaceholder.style.width = "100%";
        this._canvasPlaceholder.style.height = "100%";
        this._canvasPlaceholder.style.cursor = "pointer";
        this._palettePlaceholder = document.createElement("div");
        this._palettePlaceholder.style.position = "absolute";
        this._palettePlaceholder.style.right = "0px";
        this._palettePlaceholder.style.top = "0px";
        this._palettePlaceholder.style.bottom = "0px";
        this._palettePlaceholder.style.width = Math.round((1 - App.Percent) * 100) + "%";
        this._palettePlaceholder.style.display = "none";
        this._titlePlaceholder = document.createElement("div");
        this._titlePlaceholder.style.position = "absolute";
        this._titlePlaceholder.style.left = "0px";
        this._titlePlaceholder.style.top = "0px";
        this._titlePlaceholder.style.width = Math.round(App.Percent * 100) + "%";
        this._titlePlaceholder.style.height = Math.round((1 - App.Percent) * 100) + "%";
        this._titlePlaceholder.style.backgroundRepeat = "no-repeat";
        this._titlePlaceholder.style.backgroundSize = "contain";
        this._titlePlaceholder.style.backgroundPosition = "left";
        this._titlePlaceholder.style.display = "none";
        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);
        this._palettePanel = new PalettePanel(this._palettePlaceholder, this._palette);
        this._canvasPanel = new CanvasPanel(this._canvasPlaceholder, this._canvas);
        document.body.onclick = function (e) {
            var element = e.target;
            if (element.closest("#app"))
                _this.Maximalize();
            else
                _this.Minimalize();
        };
    };
    App.prototype.Minimalize = function () {
        var _this = this;
        if (this._placeholder.style.width != "100px") {
            this.Animate(0, 1, function (op) {
                var size = App.Size - op * (App.Size - 100);
                _this._placeholder.style.width = size + "px";
                _this._placeholder.style.height = size + "px";
                _this._placeholder.style.top = "calc(" + App.YPos + "% - " + size + "px * " + App.YPos / 100 + ")";
                _this._placeholder.style.left = "calc(" + App.XPos + "% - " + size + "px * " + App.XPos / 100 + ")";
                var percent = App.Percent + op * (1 - App.Percent);
                _this._canvasPlaceholder.style.width = Math.round(percent * 100) + "%";
                _this._canvasPlaceholder.style.height = Math.round(percent * 100) + "%";
                if (op > 0.9) {
                    _this._titlePlaceholder.style.display = "none";
                    _this._palettePlaceholder.style.display = "none";
                }
                if (op > 0.5) {
                    _this._statusPlaceholder.style.display = "none";
                    _this._iconStatusPlaceholder.style.display = "flex";
                }
                _this._canvasPanel.Maximized = size > 300;
            }, 100);
        }
    };
    App.prototype.Maximalize = function () {
        var _this = this;
        if (this._placeholder.style.width != App.Size + "px") {
            this.Animate(1, 0, function (op) {
                var size = App.Size - op * (App.Size - 100);
                _this._placeholder.style.width = size + "px";
                _this._placeholder.style.height = size + "px";
                _this._placeholder.style.top = "calc(" + App.YPos + "% - " + size + "px * " + App.YPos / 100 + ")";
                _this._placeholder.style.left = "calc(" + App.XPos + "% - " + size + "px * " + App.XPos / 100 + ")";
                var percent = App.Percent + op * (1 - App.Percent);
                _this._canvasPlaceholder.style.width = Math.round(percent * 100) + "%";
                _this._canvasPlaceholder.style.height = Math.round(percent * 100) + "%";
                if (op < 0.9) {
                    _this._titlePlaceholder.style.display = "";
                    _this._palettePlaceholder.style.display = "";
                }
                if (op < 0.5) {
                    _this._statusPlaceholder.style.display = "flex";
                    _this._iconStatusPlaceholder.style.display = "none";
                }
                _this._canvasPanel.Maximized = size > 300;
            }, 100);
        }
    };
    App.prototype.OnBackgroundChanged = function () {
        var img = new Image();
        img.src = this._client.Background;
        this._placeholder.style.backgroundImage = "url('" + img.src + "')";
        this.OnDataReceived(1);
    };
    App.prototype.OnTitleChanged = function () {
        var img = new Image();
        img.src = this._client.Title;
        this._titlePlaceholder.style.backgroundImage = "url('" + img.src + "')";
        this.OnDataReceived(2);
    };
    App.prototype.OnPaletteChanged = function () {
        this.OnDataReceived(4);
    };
    App.prototype.OnDataReceived = function (mask) {
        this._loadedData |= mask;
        if ((this._loadedData & 7) == 7) {
            this._placeholder.innerHTML = "";
            this._placeholder.append(this._titlePlaceholder);
            this._placeholder.append(this._palettePlaceholder);
            this._placeholder.append(this._canvasPlaceholder);
        }
        else {
            var progress = 0;
            if ((this._loadedData & 1) > 0)
                progress++;
            if ((this._loadedData & 2) > 0)
                progress++;
            if ((this._loadedData & 4) > 0)
                progress++;
            this._statusPlaceholder.innerText = "Loading... " + progress + "/3";
        }
    };
    App.prototype.OnConnect = function () {
        this._statusPlaceholder.innerText = "Loading... 0/3";
    };
    App.prototype.OnMissingRoom = function () {
        var _this = this;
        this._statusPlaceholder.innerText = "Room not found...\nBut we are looking for it";
        setTimeout(function () {
            _this._client.TryJoinRoom();
        }, 2000);
    };
    App.prototype.OnKick = function (reason) {
        var _this = this;
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);
        if (reason === "room_destroyed") {
            this._statusPlaceholder.innerText = "Room has been destroyed\nTrying to rejoin...";
            setTimeout(function () {
                _this._client.TryJoinRoom();
            }, 2000);
        }
        else {
            this._iconImg.src = "disconnected.png";
            reason = reason.trim();
            if (reason.length > 0)
                this._statusPlaceholder.innerText = "You has been kicked\nReason: " + reason;
            else
                this._statusPlaceholder.innerText = "You has been kicked";
        }
    };
    App.prototype.OnDisconnect = function () {
        var _this = this;
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._placeholder.append(this._iconStatusPlaceholder);
        this._statusPlaceholder.innerText = "Unable to establish connection to hub";
        this._isDead = true;
        setTimeout(function () {
            var start = parseFloat(_this._placeholder.style.opacity);
            if (isNaN(start))
                start = 1;
            _this.Animate(start, 0, function (op) { return _this._placeholder.style.opacity = op; }, 200);
        }, 2000);
        setTimeout(function () {
            _this._placeholder.innerHTML = "";
        }, 2200);
    };
    App.prototype.Animate = function (start, finist, applyF, time) {
        var _this = this;
        if (this._animationInterval !== undefined)
            clearInterval(this._animationInterval);
        var step = Math.abs((start - finist) / (time / 10));
        var current = start;
        this._animationInterval = setInterval(function () {
            if (start > finist) {
                if (current > finist)
                    current -= step;
                else
                    clearInterval(_this._animationInterval);
                applyF(Math.max(current, finist));
            }
            else {
                if (current < finist)
                    current += step;
                else
                    clearInterval(_this._animationInterval);
                applyF(Math.min(current, finist));
            }
        }, 10);
    };
    App.Size = 600;
    App.Percent = 0.75;
    App.XPos = 100;
    App.YPos = 10;
    return App;
}());
var Config = (function () {
    function Config(placeholder, version) {
        var _this = this;
        this._options = [
            new IntConfigOption("app_size", "Size (px)").SetMin(300).SetMax(700).SetDefault(600),
            new IntConfigOption("app_percent", "Canvas Size Percent (%)").SetMin(0).SetMax(100).SetStep(1).SetDefault(75),
            new IntConfigOption("app_xpos", "X Pos (%)").SetMin(0).SetMax(100).SetDefault(100),
            new IntConfigOption("app_ypos", "Y Pos (%)").SetMin(0).SetMax(100).SetDefault(10),
            new IntConfigOption("fp_animationtime", "Pixel Animation Time (ms)").SetMin(0).SetMax(60000).SetStep(1).SetDefault(1333),
            new FloatConfigOption("fp_traveldistancestart", "Pixel Travel Start (unit)").SetMin(-100).SetMax(100).SetStep(0.01).SetDefault(0.5),
            new FloatConfigOption("fp_traveldistance", "Pixel Travel Distance (unit)").SetMin(-100).SetMax(100).SetStep(0.01).SetDefault(1.5),
            new FloatConfigOption("fp_rotationangle", "Pixel Rotation Angle (deg)").SetMin(-360).SetMax(360).SetStep(0.01).SetDefault(1.5),
            new IntConfigOption("fp_rotationtime", "Pixel Rotation Time (ms)").SetMin(0).SetMax(60000).SetStep(1).SetDefault(2000),
            new FloatConfigOption("fp_sizemultiplier", "Pixel Size Multiplier").SetMin(0).SetMax(100).SetStep(0.01).SetDefault(1.1)
        ];
        this._placeholder = placeholder;
        this._version = version;
        this._placeholder.className = "p-4 bg-white";
        var errorDiv = document.createElement("div");
        errorDiv.style.display = "none";
        errorDiv.className = "bg-danger text-light m-1 p-3 rounded";
        this._placeholder.append(errorDiv);
        var table = document.createElement("table");
        table.style.width = "100%";
        this._placeholder.append(table);
        Twitch.ext.onAuthorized(function (auth) {
            var save = {};
            if (Twitch.ext.configuration.broadcaster !== undefined)
                try {
                    save = JSON.parse(Twitch.ext.configuration.broadcaster.content);
                }
                catch (e) { }
            for (var i = 0; i < _this._options.length; i++) {
                var tr = document.createElement("tr");
                var td0 = document.createElement("td");
                var td1 = document.createElement("td");
                td0.innerText = _this._options[i].Text;
                td0.style.padding = "8px";
                var el = _this._options[i].GetElement(save[_this._options[i].Name]);
                el.style.width = "100%";
                td1.style.padding = "8px";
                td1.append(el);
                tr.append(td0);
                tr.append(td1);
                table.append(tr);
            }
            var btn = document.createElement("button");
            btn.style.backgroundColor = "#6441A4";
            btn.className = "btn text-white";
            btn.innerText = "Save";
            btn.onclick = function () {
                var save = {};
                var hasInvalid = false;
                var errorText = "";
                for (var i = 0; i < _this._options.length; i++) {
                    if (!_this._options[i].IsValueValid()) {
                        hasInvalid = true;
                        errorText += _this._options[i].GetErrorText() + "\n";
                    }
                    save[_this._options[i].Name] = _this._options[i].GetValue();
                }
                if (hasInvalid) {
                    errorDiv.style.display = "";
                    errorDiv.innerText = errorText;
                }
                else {
                    errorDiv.style.display = "none";
                    errorDiv.innerText = errorText;
                    console.log(save);
                    Twitch.ext.configuration.set("broadcaster", _this._version, JSON.stringify(save));
                }
            };
            _this._placeholder.append(btn);
        });
    }
    return Config;
}());
var AConfigOption = (function () {
    function AConfigOption(name, text, type) {
        this.Name = name;
        this.Text = text;
        this.Type = type;
    }
    AConfigOption.prototype.SetDefault = function (def) {
        this.Default = def;
        return this;
    };
    return AConfigOption;
}());
var NumberConfigOption = (function (_super) {
    __extends(NumberConfigOption, _super);
    function NumberConfigOption(name, text, type) {
        var _this = _super.call(this, name, text, type) || this;
        _this._el = document.createElement("input");
        _this._el.placeholder = _this.Text;
        _this._el.type = "number";
        _this._el.className = "form-control";
        return _this;
    }
    NumberConfigOption.prototype.SetMin = function (min) {
        this._isMinSetted = true;
        this._min = min;
        this._el.min = min.toString();
        return this;
    };
    NumberConfigOption.prototype.SetMax = function (max) {
        this._isMaxSetted = true;
        this._max = max;
        this._el.max = max.toString();
        return this;
    };
    NumberConfigOption.prototype.SetStep = function (step) {
        this._isStepSetted = true;
        this._step = step;
        this._el.step = step.toString();
        return this;
    };
    NumberConfigOption.prototype.GetElement = function (value) {
        if (value !== undefined)
            this._el.value = value;
        else
            this._el.value = this.Default;
        return this._el;
    };
    NumberConfigOption.prototype.GetValue = function () {
        return this._el.value;
    };
    NumberConfigOption.prototype.GetErrorText = function () {
        if (this._isMinSetted && this._isMaxSetted)
            return "'" + this.Text + "' must be more or equals " + this._min + " and less or equals " + this._max;
        if (this._isMinSetted && !this._isMaxSetted)
            return "'" + this.Text + "' must be more or equals " + this._min;
        if (!this._isMinSetted && this._isMaxSetted)
            return "'" + this.Text + "' must be and less or equals " + this._max;
        return "";
    };
    return NumberConfigOption;
}(AConfigOption));
var ConfigOptionTypes;
(function (ConfigOptionTypes) {
    ConfigOptionTypes[ConfigOptionTypes["String"] = 0] = "String";
    ConfigOptionTypes[ConfigOptionTypes["Int"] = 1] = "Int";
    ConfigOptionTypes[ConfigOptionTypes["Float"] = 2] = "Float";
    ConfigOptionTypes[ConfigOptionTypes["Select"] = 3] = "Select";
})(ConfigOptionTypes || (ConfigOptionTypes = {}));
var FloatConfigOption = (function (_super) {
    __extends(FloatConfigOption, _super);
    function FloatConfigOption(name, text) {
        return _super.call(this, name, text, ConfigOptionTypes.Float) || this;
    }
    FloatConfigOption.prototype.GetValue = function () {
        var str = _super.prototype.GetValue.call(this);
        var ret = parseFloat(str);
        if (this._isStepSetted)
            return Math.round(ret * 100 - (ret * 100) % (this._step * 100)) / 100;
        else
            return ret;
    };
    FloatConfigOption.prototype.IsValueValid = function () {
        var val = this.GetValue();
        if (isNaN(val))
            return false;
        if (this._isMinSetted && val < this._min)
            return false;
        if (this._isMaxSetted && val > this._max)
            return false;
        return true;
    };
    return FloatConfigOption;
}(NumberConfigOption));
var IntConfigOption = (function (_super) {
    __extends(IntConfigOption, _super);
    function IntConfigOption(name, text) {
        return _super.call(this, name, text, ConfigOptionTypes.Int) || this;
    }
    IntConfigOption.prototype.GetValue = function () {
        var str = _super.prototype.GetValue.call(this);
        var ret = parseInt(str);
        if (this._isStepSetted)
            return ret - ret % this._step;
        else
            return ret;
    };
    IntConfigOption.prototype.IsValueValid = function () {
        var val = this.GetValue();
        if (isNaN(val))
            return false;
        if (this._isMinSetted && val < this._min)
            return false;
        if (this._isMaxSetted && val > this._max)
            return false;
        return true;
    };
    return IntConfigOption;
}(NumberConfigOption));
var SelectConfigOption = (function (_super) {
    __extends(SelectConfigOption, _super);
    function SelectConfigOption(name, text, options) {
        var _this = _super.call(this, name, text, ConfigOptionTypes.Select) || this;
        _this._options = options;
        _this._el = document.createElement("select");
        for (var i = 0; i < _this._options.length; i++) {
            var opt = document.createElement("option");
            opt.value = _this._options[i].name;
            opt.innerText = _this._options[i].text;
            _this._el.append(opt);
        }
        _this._el.className = "form-control";
        return _this;
    }
    SelectConfigOption.prototype.GetElement = function () {
        return this._el;
    };
    SelectConfigOption.prototype.GetValue = function () {
        return this._el.value;
    };
    SelectConfigOption.prototype.IsValueValid = function () {
        return true;
    };
    SelectConfigOption.prototype.GetErrorText = function () {
        return "";
    };
    return SelectConfigOption;
}(AConfigOption));
var StringConfigOption = (function (_super) {
    __extends(StringConfigOption, _super);
    function StringConfigOption(name, text) {
        var _this = _super.call(this, name, text, ConfigOptionTypes.String) || this;
        _this._isMinSetted = false;
        _this._isMaxSetted = false;
        _this._el = document.createElement("input");
        _this._el.placeholder = _this.Text;
        _this._el.type = "text";
        _this._el.className = "form-control";
        return _this;
    }
    StringConfigOption.prototype.SetMinLength = function (minLen) {
        this._isMinSetted = true;
        this._minLength = minLen;
        this._el.minLength = minLen;
        return this;
    };
    StringConfigOption.prototype.SetMaxLength = function (maxLen) {
        this._isMaxSetted = true;
        this._maxLength = maxLen;
        this._el.maxLength = maxLen;
        return this;
    };
    StringConfigOption.prototype.GetElement = function (value) {
        if (value !== undefined)
            this._el.value = value;
        else
            this._el.value = this.Default;
        return this._el;
    };
    StringConfigOption.prototype.GetValue = function () {
        return this._el.value;
    };
    StringConfigOption.prototype.IsValueValid = function () {
        var val = this.GetValue();
        if (this._isMinSetted && val.length < this._minLength)
            return false;
        if (this._isMaxSetted && val.length > this._maxLength)
            return false;
        return true;
    };
    StringConfigOption.prototype.GetErrorText = function () {
        if (this._isMinSetted && this._isMaxSetted)
            return "'" + this.Text + "' must be more or equals " + this._minLength + " and less or equals " + this._maxLength + " characters";
        if (this._isMinSetted && !this._isMaxSetted)
            return "'" + this.Text + "' must be more or equals " + this._minLength + " characters";
        if (!this._isMinSetted && this._isMaxSetted)
            return "'" + this.Text + "' must be and less or equals " + this._maxLength + " characters";
        return "";
    };
    return StringConfigOption;
}(AConfigOption));
var Color = (function () {
    function Color(name, rgb) {
        this.Name = name;
        this.RGB = rgb;
        this.Hex = this.ToHex(rgb);
    }
    Color.prototype.Update = function (rgb) {
        this.RGB = rgb;
        this.Hex = this.ToHex(rgb);
    };
    Color.prototype.ToHex = function (i) {
        var rrggbb = ("000000" + i.toString(16)).slice(-6);
        return "#" + rrggbb;
    };
    return Color;
}());
var Palette = (function () {
    function Palette() {
        this.SelectedColor = 0;
        this.Colors = [];
        this._onChangeFuncs = [];
    }
    Palette.prototype.GetSelectedColor = function () {
        if (this.SelectedColor < 0 || this.SelectedColor >= this.Colors.length)
            return Palette.NullColor;
        return this.Colors[this.SelectedColor];
    };
    Palette.prototype.SelectColor = function (color) {
        if (typeof (color) === "number") {
            if (color < 0 || color >= this.Colors.length)
                color = 0;
            this.SelectedColor = color;
        }
        else {
            var index = this.Colors.indexOf(color);
            if (index >= 0)
                this.SelectedColor = index;
            else
                this.SelectedColor = 0;
        }
    };
    Palette.prototype.AddOrUpdateColor = function (name, rgb, triggerEvent) {
        if (triggerEvent === void 0) { triggerEvent = true; }
        var filter = this.Colors.filter(function (c) { return c.Name == name; });
        if (filter.length > 0) {
            filter.forEach(function (i) { return i.Update(rgb); });
        }
        else {
            this.Colors.push(new Color(name, rgb));
        }
        if (triggerEvent)
            this.Changed();
    };
    Palette.prototype.ParseColors = function (palette) {
        var split = palette.split(";");
        for (var i = 0; i < split.length; i++) {
            var kv = split[i].split("=");
            if (kv.length != 2)
                continue;
            var colorname = kv[0];
            var rgb = parseInt(kv[1]);
            if (isNaN(rgb))
                continue;
            this.AddOrUpdateColor(colorname, rgb, false);
        }
        this.Changed();
    };
    Palette.prototype.GetColorByName = function (name) {
        var filter = this.Colors.filter(function (c) { return c.Name.toLowerCase() == name.toLowerCase(); });
        if (filter.length > 0)
            return filter[0];
        else
            return undefined;
    };
    Palette.prototype.ClearPalette = function () {
        this.Colors = [];
        this.Changed();
    };
    Palette.prototype.Changed = function () {
        for (var i = 0; i < this._onChangeFuncs.length; i++) {
            this._onChangeFuncs[i]();
        }
    };
    Palette.prototype.OnChange = function (func) {
        this._onChangeFuncs.push(func);
    };
    Palette.NullColor = new Color("null", 2105376);
    return Palette;
}());
var Canvas = (function () {
    function Canvas(palette) {
        this.History = [];
        this.FloatingPixels = [];
        this.Palette = palette;
        this._canvas = [];
        for (var iy = 0; iy < Canvas.Height; iy++) {
            this._canvas.push([]);
            for (var ix = 0; ix < Canvas.Width; ix++) {
                this._canvas[iy][ix] = Palette.NullColor;
            }
        }
    }
    Canvas.prototype.DrawPixel = function (x, y) {
        var color = this.Palette.GetSelectedColor();
        this.SetPixel(x, y, color);
    };
    Canvas.prototype.SetPixel = function (x, y, color, ignoreHistory) {
        if (ignoreHistory === void 0) { ignoreHistory = false; }
        if (x < 0 || x >= Canvas.Width)
            return;
        if (y < 0 || y >= Canvas.Height)
            return;
        if (this._canvas[y][x] !== color) {
            this._canvas[y][x] = color;
            if (!ignoreHistory)
                this.History.push(new HistoryItem(x, y, color));
        }
    };
    Canvas.prototype.CreateFloatingPixel = function (x, y, color, username) {
        if (x < 0 || x >= Canvas.Width)
            return;
        if (y < 0 || y >= Canvas.Height)
            return;
        var fp = new FloatingPixel();
        fp.X = x;
        fp.Y = y;
        fp.Color = color;
        fp.Username = username;
        this.FloatingPixels.push(fp);
    };
    Canvas.prototype.GetPixel = function (x, y) {
        if (x < 0 || x >= Canvas.Width)
            return Palette.NullColor;
        if (y < 0 || y >= Canvas.Height)
            return Palette.NullColor;
        return this._canvas[y][x];
    };
    Canvas.prototype.ParceCanvas = function (data) {
        var split = data.split(";");
        for (var i = 0; i < split.length; i++) {
            var kv = split[i].split("=");
            if (kv.length != 2)
                continue;
            var coordsStr = kv[0];
            var colorname = kv[1];
            var coords = this.ParseCoordinate(coordsStr);
            if (coords === undefined)
                continue;
            var color = this.Palette.GetColorByName(colorname);
            if (color === undefined)
                continue;
            this.SetPixel(coords.x, coords.y, color, true);
        }
    };
    Canvas.prototype.ClearCanvas = function () {
        for (var iy = 0; iy < Canvas.Height; iy++) {
            for (var ix = 0; ix < Canvas.Width; ix++) {
                this._canvas[iy][ix] = Palette.NullColor;
            }
        }
    };
    Canvas.prototype.ParseCoordinate = function (str) {
        str = str.toUpperCase();
        if (str.length > 8)
            return undefined;
        var charCoordIndex = -1;
        for (var i = str.length - 1; i >= 0; i--) {
            if (charCoordIndex < 0) {
                if (Canvas.Letters.indexOf(str[i]) >= 0) {
                    charCoordIndex = i;
                }
            }
            else {
                if (Canvas.Letters.indexOf(str[i]) < 0) {
                    return undefined;
                }
            }
        }
        if (charCoordIndex < 0)
            return undefined;
        charCoordIndex++;
        var charCoord = str.substring(0, charCoordIndex);
        var numberCoord = str.substring(charCoordIndex);
        if (charCoord.length == 0)
            return undefined;
        if (numberCoord.length == 0)
            return undefined;
        var x = 0;
        for (var i = 0; i < charCoord.length; i++) {
            var index = Canvas.Letters.indexOf(charCoord[i]) + 1;
            var exp = charCoord.length - i - 1;
            x += Math.pow(Canvas.Letters.length, exp) * index;
        }
        var y = parseInt(numberCoord);
        x--;
        y--;
        return { x: x, y: y };
    };
    Canvas.prototype.GetVerticalCoord = function (y) {
        return Canvas.Letters[y % Canvas.Letters.length];
    };
    Canvas.Width = 16;
    Canvas.Height = 16;
    Canvas.Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Canvas;
}());
var HistoryItem = (function () {
    function HistoryItem(x, y, color) {
        this.X = x;
        this.Y = y;
        this.Color = color;
    }
    return HistoryItem;
}());
var WebClient = (function () {
    function WebClient(uri, canvas, auth) {
        var _this = this;
        this.Interval = 2500;
        this.OnBackgroundChanged = undefined;
        this.OnTitleChanged = undefined;
        this.OnConnected = undefined;
        this.OnMissingRoom = undefined;
        this.OnKick = undefined;
        this.OnDisconnected = undefined;
        this._uri = uri;
        this.Canvas = canvas;
        this._auth = auth;
        this._commands = new Commands(this);
        this.StartTimer(function () { return _this.ProcessHistory(); });
        this.Open();
    }
    WebClient.prototype.StartTimer = function (func) {
        var _this = this;
        setTimeout(function () {
            func();
            _this.StartTimer(func);
        }, this.Interval);
    };
    WebClient.prototype.SetBackground = function (bg) {
        this.Background = bg;
        if (this.OnBackgroundChanged !== undefined)
            this.OnBackgroundChanged();
    };
    WebClient.prototype.SetTitle = function (title) {
        this.Title = title;
        if (this.OnTitleChanged !== undefined)
            this.OnTitleChanged();
    };
    WebClient.prototype.ProcessHistory = function () {
        if (this.IsConnected && this.Canvas.History.length > 0) {
            var item = this.Canvas.History.shift();
            this.SendMessage("setpixel " + this.Canvas.GetVerticalCoord(item.X) + (item.Y + 1) + " " + item.Color.Name);
        }
    };
    WebClient.prototype.SendMessage = function (message) {
        if (this.IsConnected) {
            this._socket.send(message + "\n");
        }
    };
    WebClient.prototype.Connected = function () {
        if (this.OnConnected !== undefined)
            this.OnConnected();
        this.SendMessage("getbackground");
        this.SendMessage("gettitle");
        this.SendMessage("getcolors");
        this.SendMessage("getcanvas");
        this.SendMessage("getinterval");
    };
    WebClient.prototype.MissingRoom = function () {
        if (this.OnMissingRoom !== undefined)
            this.OnMissingRoom();
    };
    WebClient.prototype.Kicked = function (reason) {
        if (this.OnKick !== undefined)
            this.OnKick(reason);
    };
    WebClient.prototype.Open = function () {
        var _this = this;
        this._socket = new WebSocket(this._uri);
        this._socket.onopen = function (e) { _this.OnOpen(e); };
        this._socket.onmessage = function (e) { _this.OnMessage(e); };
        this._socket.onclose = function (e) { _this.OnClose(e); };
        this._socket.onerror = function (e) { _this.OnError(e); };
    };
    WebClient.prototype.Close = function () {
        this._socket.close(1000, "");
        this.IsConnected = false;
    };
    WebClient.prototype.OnOpen = function (event) {
        this.IsConnected = true;
        this._jwt = this.ParseJwt(this._auth.token);
        this.TryJoinRoom();
    };
    WebClient.prototype.TryJoinRoom = function () {
        if (this.IsConnected && this._jwt.user_id !== undefined) {
            this.SendMessage("joinroom " + this._auth.channelId + " " + this._jwt.user_id);
        }
    };
    WebClient.prototype.OnMessage = function (message) {
        if (typeof (message.data) === "string") {
            var commands = message.data.split("\n").filter(function (c) { return c !== ""; });
            for (var i = 0; i < commands.length; i++) {
                this._commands.Execute(commands[i]);
            }
        }
    };
    WebClient.prototype.OnClose = function (event) {
        this.IsConnected = false;
        if (this.OnDisconnected !== undefined)
            this.OnDisconnected();
    };
    WebClient.prototype.OnError = function (error) {
        if (this.IsConnected)
            this._socket.close();
        this.IsConnected = false;
    };
    WebClient.prototype.ParseJwt = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };
    ;
    return WebClient;
}());
var ACommand = (function () {
    function ACommand(name, client) {
        this.Name = name.toLowerCase();
        this.Client = client;
    }
    return ACommand;
}());
var Commands = (function () {
    function Commands(client) {
        this._commands = [];
        this._commands.push(new ClearPaletteCommand(client));
        this._commands.push(new GetBackgroundCommand(client));
        this._commands.push(new GetCanvasCommand(client));
        this._commands.push(new GetColorsCommand(client));
        this._commands.push(new GetIntervalCommand(client));
        this._commands.push(new GetTitleCommand(client));
        this._commands.push(new JoinRoomCommand(client));
        this._commands.push(new KickedCommand(client));
        this._commands.push(new SetBackgroundCommand(client));
        this._commands.push(new SetColorCommand(client));
        this._commands.push(new SetIntervalCommand(client));
        this._commands.push(new SetPixelCommand(client));
        this._commands.push(new SetTitleCommand(client));
    }
    Commands.prototype.Execute = function (str) {
        var parts = str.split(' ');
        if (parts.length < 2)
            return;
        var filter = this._commands.filter(function (c) { return c.Name == parts[1]; });
        if (filter.length != 1)
            return;
        var command = filter[0];
        if (parts[0] == "info") {
            command.OnInfo(parts.slice(2));
        }
        else if (parts[0] == "error") {
            var code = parseInt(parts[2]);
            var message = parts.slice(3).join(" ");
            command.OnError(code, message);
        }
    };
    return Commands;
}());
var ClearPaletteCommand = (function (_super) {
    __extends(ClearPaletteCommand, _super);
    function ClearPaletteCommand(client) {
        return _super.call(this, "clearpalette", client) || this;
    }
    ClearPaletteCommand.prototype.OnInfo = function (data) {
        this.Client.Canvas.Palette.ClearPalette();
    };
    ClearPaletteCommand.prototype.OnError = function (code, error) {
    };
    return ClearPaletteCommand;
}(ACommand));
var GetBackgroundCommand = (function (_super) {
    __extends(GetBackgroundCommand, _super);
    function GetBackgroundCommand(client) {
        return _super.call(this, "getbackground", client) || this;
    }
    GetBackgroundCommand.prototype.OnInfo = function (data) {
        var base64 = data.join(" ");
        this.Client.SetBackground(base64);
    };
    GetBackgroundCommand.prototype.OnError = function (code, error) {
    };
    return GetBackgroundCommand;
}(ACommand));
var GetCanvasCommand = (function (_super) {
    __extends(GetCanvasCommand, _super);
    function GetCanvasCommand(client) {
        return _super.call(this, "getcanvas", client) || this;
    }
    GetCanvasCommand.prototype.OnInfo = function (data) {
        var canvas = data.join(" ");
        this.Client.Canvas.ParceCanvas(canvas);
    };
    GetCanvasCommand.prototype.OnError = function (code, error) {
    };
    return GetCanvasCommand;
}(ACommand));
var GetColorsCommand = (function (_super) {
    __extends(GetColorsCommand, _super);
    function GetColorsCommand(client) {
        return _super.call(this, "getcolors", client) || this;
    }
    GetColorsCommand.prototype.OnInfo = function (data) {
        var palette = data.join(" ");
        this.Client.Canvas.Palette.ClearPalette();
        this.Client.Canvas.Palette.ParseColors(palette);
    };
    GetColorsCommand.prototype.OnError = function (code, error) {
    };
    return GetColorsCommand;
}(ACommand));
var GetIntervalCommand = (function (_super) {
    __extends(GetIntervalCommand, _super);
    function GetIntervalCommand(client) {
        return _super.call(this, "getinterval", client) || this;
    }
    GetIntervalCommand.prototype.OnInfo = function (data) {
        if (data.length < 0)
            return;
        var num = parseInt(data[0]);
        if (num <= 0)
            return;
        this.Client.Interval = num;
    };
    GetIntervalCommand.prototype.OnError = function (code, error) {
    };
    return GetIntervalCommand;
}(ACommand));
var GetTitleCommand = (function (_super) {
    __extends(GetTitleCommand, _super);
    function GetTitleCommand(client) {
        return _super.call(this, "gettitle", client) || this;
    }
    GetTitleCommand.prototype.OnInfo = function (data) {
        var base64 = data.join(" ");
        this.Client.SetTitle(base64);
    };
    GetTitleCommand.prototype.OnError = function (code, error) {
    };
    return GetTitleCommand;
}(ACommand));
var SetBackgroundCommand = (function (_super) {
    __extends(SetBackgroundCommand, _super);
    function SetBackgroundCommand(client) {
        return _super.call(this, "setbackground", client) || this;
    }
    SetBackgroundCommand.prototype.OnInfo = function (data) {
        var base64 = data.join(" ");
        this.Client.SetBackground(base64);
    };
    SetBackgroundCommand.prototype.OnError = function (code, error) {
    };
    return SetBackgroundCommand;
}(ACommand));
var SetColorCommand = (function (_super) {
    __extends(SetColorCommand, _super);
    function SetColorCommand(client) {
        return _super.call(this, "setcolor", client) || this;
    }
    SetColorCommand.prototype.OnInfo = function (data) {
        if (data.length != 2)
            return;
        var colorname = data[0];
        var colorrgb = parseInt(data[1]);
        if (isNaN(colorrgb))
            return;
        this.Client.Canvas.Palette.AddOrUpdateColor(colorname, colorrgb);
    };
    SetColorCommand.prototype.OnError = function (code, error) {
    };
    return SetColorCommand;
}(ACommand));
var JoinRoomCommand = (function (_super) {
    __extends(JoinRoomCommand, _super);
    function JoinRoomCommand(client) {
        return _super.call(this, "joinroom", client) || this;
    }
    JoinRoomCommand.prototype.OnInfo = function (data) {
        this.Client.Connected();
    };
    JoinRoomCommand.prototype.OnError = function (code, error) {
        if (code === 404) {
            if (this.Client.OnMissingRoom)
                this.Client.OnMissingRoom();
        }
    };
    return JoinRoomCommand;
}(ACommand));
var KickedCommand = (function (_super) {
    __extends(KickedCommand, _super);
    function KickedCommand(client) {
        return _super.call(this, "kicked", client) || this;
    }
    KickedCommand.prototype.OnInfo = function (data) {
        this.Client.Kicked(data.join(" "));
    };
    KickedCommand.prototype.OnError = function (code, error) {
    };
    return KickedCommand;
}(ACommand));
var SetIntervalCommand = (function (_super) {
    __extends(SetIntervalCommand, _super);
    function SetIntervalCommand(client) {
        return _super.call(this, "setinterval", client) || this;
    }
    SetIntervalCommand.prototype.OnInfo = function (data) {
        if (data.length < 0)
            return;
        var num = parseInt(data[0]);
        if (num <= 0)
            return;
        this.Client.Interval = num;
    };
    SetIntervalCommand.prototype.OnError = function (code, error) {
    };
    return SetIntervalCommand;
}(ACommand));
var SetPixelCommand = (function (_super) {
    __extends(SetPixelCommand, _super);
    function SetPixelCommand(client) {
        return _super.call(this, "setpixel", client) || this;
    }
    SetPixelCommand.prototype.OnInfo = function (data) {
        if (data.length == 1 && data[0] == "OK")
            return;
        if (data.length < 3)
            return;
        var username = data[0];
        var coordStr = data[1];
        var colorname = data.slice(2).join(" ");
        var coords = this.Client.Canvas.ParseCoordinate(coordStr);
        if (coords === undefined)
            return;
        var color = this.Client.Canvas.Palette.GetColorByName(colorname);
        if (color === undefined)
            return;
        this.Client.Canvas.SetPixel(coords.x, coords.y, color, true);
        this.Client.Canvas.CreateFloatingPixel(coords.x, coords.y, color, username);
    };
    SetPixelCommand.prototype.OnError = function (code, error) {
    };
    return SetPixelCommand;
}(ACommand));
var SetTitleCommand = (function (_super) {
    __extends(SetTitleCommand, _super);
    function SetTitleCommand(client) {
        return _super.call(this, "settitle", client) || this;
    }
    SetTitleCommand.prototype.OnInfo = function (data) {
        var base64 = data.join(" ");
        this.Client.SetTitle(base64);
    };
    SetTitleCommand.prototype.OnError = function (code, error) {
    };
    return SetTitleCommand;
}(ACommand));
var CanvasPanel = (function () {
    function CanvasPanel(placeholder, canvas) {
        var _this = this;
        this._padding = 4;
        this._mouseX = -1;
        this._mouseY = -1;
        this._isMouseDown = false;
        this.Maximized = false;
        this._placehloder = placeholder;
        this._canvas = canvas;
        this._width = Math.round(App.Size * App.Percent);
        this._height = Math.round(App.Size * App.Percent);
        this._htmlCanvas = document.createElement("canvas");
        this._htmlCanvas.style.width = "100%";
        this._htmlCanvas.style.height = "100%";
        this._htmlCanvas.width = this._width;
        this._htmlCanvas.height = this._height;
        this._htmlCanvas.onmousemove = function (evt) { return _this.OnMouseMove(evt); };
        this._htmlCanvas.onmouseleave = function (evt) { return _this.OnMouseLeave(evt); };
        this._htmlCanvas.onmousedown = function (evt) { return _this.OnMouseDown(evt); };
        this._htmlCanvas.onmouseup = function (evt) { return _this.OnMouseUp(evt); };
        placeholder.append(this._htmlCanvas);
        this._context = this._htmlCanvas.getContext("2d");
        this.Draw();
        setInterval(function () { return _this.Draw(); }, 20);
    }
    CanvasPanel.prototype.Draw = function () {
        this._context.clearRect(0, 0, this._width, this._height);
        var w = this._width - this._padding * 2;
        var h = this._height - this._padding * 2;
        var itemW = w / (Canvas.Width + (this.Maximized ? 1 : 0));
        var itemH = h / (Canvas.Height + (this.Maximized ? 1 : 0));
        for (var iy = 0; iy < Canvas.Height; iy++) {
            for (var ix = 0; ix < Canvas.Width; ix++) {
                if (this.Maximized && this._mouseX == ix && this._mouseY == iy)
                    this._context.fillStyle = this._canvas.Palette.GetSelectedColor().Hex;
                else
                    this._context.fillStyle = this._canvas.GetPixel(ix, iy).Hex;
                var x = this._padding + (this.Maximized ? itemW : 0) + ix * itemW;
                var y = this._padding + iy * itemH;
                this._context.fillRect(x - 1, y - 1, itemW + 1, itemH + 1);
            }
        }
        try {
            this._context.lineWidth = 1;
            this._context.textAlign = "center";
            this._context.textBaseline = "middle";
            this._context.font = "normal 12px monospace";
            this._context.fillStyle = "#FFFFFF";
        }
        catch (ex) { }
        if (this.Maximized) {
            for (var i_1 = 0; i_1 < Canvas.Height; i_1++) {
                var x = itemW * 0.5 + 2;
                var y = i_1 * itemH + itemH * 0.5 + 5;
                var text = "" + (i_1 + 1);
                try {
                    this._context.fillText(text, x, y);
                }
                catch (ex) { }
            }
            for (var i_2 = 0; i_2 < Canvas.Width; i_2++) {
                var x = itemW * 1.5 + i_2 * itemW + 3;
                var y = Canvas.Height * itemH + itemH * 0.5 + 5;
                var text = this._canvas.GetVerticalCoord(i_2);
                try {
                    this._context.fillText(text, x, y);
                }
                catch (ex) { }
            }
        }
        this._context.lineWidth = 2;
        this._context.strokeStyle = "#FFFFFF";
        this._context.strokeRect(this._padding + (this.Maximized ? itemW : 0), this._padding, w - (this.Maximized ? itemW : 0), h - (this.Maximized ? itemW : 0));
        if (this.Maximized &&
            this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height) {
            this._context.strokeStyle = "#FFFF33";
            this._context.strokeRect(this._padding + itemW + this._mouseX * itemW, this._padding + this._mouseY * itemH, itemW, itemH);
        }
        for (var i = 0; i < this._canvas.FloatingPixels.length; i++) {
            if (this._canvas.FloatingPixels[i].IsEnded()) {
                this._canvas.FloatingPixels.splice(i, 1);
                i--;
            }
            else if (this.Maximized) {
                var fpx = this._padding + itemW + this._canvas.FloatingPixels[i].X * itemW;
                var fpy = this._padding + this._canvas.FloatingPixels[i].Y * itemH;
                this._canvas.FloatingPixels[i].Draw(this._context, fpx, fpy, itemW, itemH);
            }
        }
    };
    CanvasPanel.prototype.OnMouseMove = function (evt) {
        if (!this.Maximized)
            return;
        this.CalculateMouseCoord(evt);
        if (this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height &&
            this._isMouseDown) {
            this._canvas.DrawPixel(this._mouseX, this._mouseY);
        }
    };
    CanvasPanel.prototype.OnMouseLeave = function (evt) {
        this._mouseX = -1;
        this._mouseY = -1;
        this._isMouseDown = false;
    };
    CanvasPanel.prototype.OnMouseDown = function (evt) {
        if (!this.Maximized)
            return;
        this.CalculateMouseCoord(evt);
        this._isMouseDown = true;
        if (this._mouseX >= 0 && this._mouseX < Canvas.Width &&
            this._mouseY >= 0 && this._mouseY < Canvas.Height &&
            this._isMouseDown) {
            this._canvas.DrawPixel(this._mouseX, this._mouseY);
        }
    };
    CanvasPanel.prototype.OnMouseUp = function (evt) {
        this._isMouseDown = false;
    };
    CanvasPanel.prototype.CalculateMouseCoord = function (evt) {
        var mousePos = this.GetMousePos(this._htmlCanvas, evt);
        var w = this._width - this._padding * 2;
        var h = this._height - this._padding * 2;
        var x = mousePos.x - this._padding;
        var y = mousePos.y - this._padding;
        this._mouseX = Math.floor(x / w * (Canvas.Width + 1)) - 1;
        this._mouseY = Math.floor(y / h * (Canvas.Height + 1));
    };
    CanvasPanel.prototype.GetMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect(), scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    };
    return CanvasPanel;
}());
var PalettePanel = (function () {
    function PalettePanel(placeholder, palette) {
        var _this = this;
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
        palette.OnChange(function () { return _this.DrawColors(); });
    }
    PalettePanel.prototype.DrawColors = function () {
        var _this = this;
        this._paddingPlaceholder.innerHTML = "";
        var _loop_1 = function (i) {
            var colorDiv = document.createElement("div");
            colorDiv.style.position = "relative";
            colorDiv.style.width = "100%";
            colorDiv.style.height = "14px";
            colorDiv.style.cursor = "pointer";
            colorDiv.style.overflow = "clip";
            if (this_1._palette.SelectedColor === i)
                colorDiv.style.color = "yellow";
            var colorPreviewDiv = document.createElement("div");
            colorPreviewDiv.style.position = "absolute";
            colorPreviewDiv.style.top = "1px";
            colorPreviewDiv.style.left = "1px";
            colorPreviewDiv.style.bottom = "1px";
            colorPreviewDiv.style.width = "12px";
            colorPreviewDiv.style.backgroundColor = this_1._palette.Colors[i].Hex;
            var colorNameDiv = document.createElement("div");
            colorNameDiv.innerText = this_1._palette.Colors[i].Name;
            colorNameDiv.style.position = "absolute";
            colorNameDiv.style.top = "1px";
            colorNameDiv.style.left = "14px";
            colorNameDiv.style.bottom = "1px";
            colorNameDiv.style.right = "1px";
            colorDiv.append(colorPreviewDiv);
            colorDiv.append(colorNameDiv);
            colorDiv.onmouseenter = function () {
                colorDiv.style.color = "yellow";
            };
            colorDiv.onmouseleave = function () {
                if (_this._palette.SelectedColor !== i)
                    colorDiv.style.color = "";
            };
            colorDiv.onclick = function () {
                _this._palette.SelectColor(i);
                for (var i_3 = 0; i_3 < _this._paddingPlaceholder.children.length; i_3++) {
                    var item = _this._paddingPlaceholder.children[i_3];
                    item.style.color = "";
                    item.style.fontWeight = "";
                }
                colorDiv.style.color = "yellow";
                colorDiv.style.fontWeight = "bold";
            };
            this_1._paddingPlaceholder.append(colorDiv);
        };
        var this_1 = this;
        for (var i = 0; i < this._palette.Colors.length; i++) {
            _loop_1(i);
        }
    };
    return PalettePanel;
}());
var productUri = "wss://wizquixtwitchpaint.azurewebsites.net/";
var testUri = "wss://localhost:5001";
var version = "0.0.1";
var appDiv = document.getElementById("app");
if (appDiv !== null)
    new App(appDiv, productUri);
var configDiv = document.getElementById("config");
if (configDiv !== null)
    new Config(configDiv, version);
var FloatingPixel = (function () {
    function FloatingPixel() {
        this._startTime = Date.now();
        var angle = Math.random() * 2 * Math.PI;
        var dist = FloatingPixel.TravelDistanceStart + Math.random() * FloatingPixel.TravelDistance;
        this._xDist = Math.cos(angle) * dist;
        this._yDist = Math.sin(angle) * dist;
    }
    FloatingPixel.prototype.Draw = function (g, x, y, w, h) {
        x += this.Progress() * this._xDist * w + w / 2;
        y += this.Progress() * this._yDist * h + h / 2;
        w *= FloatingPixel.SizeMultiplier;
        h *= FloatingPixel.SizeMultiplier;
        var rotation = this.Rotation();
        g.save();
        g.globalAlpha = this.Opacity();
        g.translate(x, y);
        g.rotate(rotation * Math.PI);
        g.fillStyle = this.Color.Hex;
        g.fillRect(-w / 2, -h / 2, w, h);
        g.strokeStyle = "#000000";
        g.strokeRect(-w / 2, -h / 2, w, h);
        g.strokeStyle = "#FFFFFF";
        g.strokeRect(-(w - 2) / 2, -(h - 2) / 2, w - 2, h - 2);
        g.restore();
    };
    FloatingPixel.prototype.Rotation = function () {
        var time = Date.now() % FloatingPixel.RotationTime;
        var progress = time / FloatingPixel.RotationTime;
        var sin = Math.sin(2 * Math.PI * progress);
        return FloatingPixel.RotationAngle * sin;
    };
    FloatingPixel.prototype.Opacity = function () {
        return Math.min(1, 2.5 * (1 - this.Progress()));
    };
    FloatingPixel.prototype.IsEnded = function () {
        return this.Progress() === 0;
    };
    FloatingPixel.prototype.Progress = function () {
        var now = Date.now();
        if (now - this._startTime > FloatingPixel.AnimationTime)
            return 0;
        else
            return (now - this._startTime) / FloatingPixel.AnimationTime;
    };
    FloatingPixel.AnimationTime = 1333;
    FloatingPixel.TravelDistanceStart = 0.5;
    FloatingPixel.TravelDistance = 1.5;
    FloatingPixel.RotationAngle = 0.025 * Math.PI;
    FloatingPixel.RotationTime = 2000;
    FloatingPixel.SizeMultiplier = 1.1;
    return FloatingPixel;
}());
//# sourceMappingURL=index.js.map