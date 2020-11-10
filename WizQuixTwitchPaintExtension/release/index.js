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
        this._palette = new Palette();
        this._canvas = new Canvas(this._palette);
        this._client = new WebClient(uri, this._canvas);
        this._palette.OnChange(function () { return _this.OnPaletteChanged(); });
        this._client.OnConnected = function () { return _this.OnConnect(); };
        this._client.OnMissingRoom = function () { return _this.OnMissingRoom(); };
        this._client.OnDisconnected = function () { return _this.OnDisconnect(); };
        this._client.OnBackgroundChanged = function () { return _this.OnBackgroundChanged(); };
        this._client.OnTitleChanged = function () { return _this.OnTitleChanged(); };
        this._placeholder = placeholder;
        placeholder.style.backgroundColor = "black";
        placeholder.style.position = "absolute";
        placeholder.style.top = "10%";
        placeholder.style.right = "0px";
        placeholder.style.width = "600px";
        placeholder.style.height = "600px";
        placeholder.style.borderRadius = "5px";
        placeholder.style.backgroundRepeat = "repeat";
        placeholder.style.backgroundSize = "contain";
        placeholder.style.backgroundPosition = "center";
        placeholder.onmouseenter = function () {
            if (!_this._isDead)
                _this.AnimateOpasity(1, 150);
        };
        placeholder.onmouseleave = function () {
            if (!_this._isDead)
                _this.AnimateOpasity(0.2, 150);
        };
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
        this._statusPlaceholder.innerText = "Connecting to Hub...";
        this._palettePlaceholder = document.createElement("div");
        this._palettePlaceholder.style.position = "absolute";
        this._palettePlaceholder.style.right = "0px";
        this._palettePlaceholder.style.top = "0px";
        this._palettePlaceholder.style.bottom = "0px";
        this._palettePlaceholder.style.width = "25%";
        this._canvasPlaceholder = document.createElement("div");
        this._canvasPlaceholder.style.position = "absolute";
        this._canvasPlaceholder.style.left = "0px";
        this._canvasPlaceholder.style.bottom = "0px";
        this._canvasPlaceholder.style.width = "75%";
        this._canvasPlaceholder.style.height = "75%";
        this._titlePlaceholder = document.createElement("div");
        this._titlePlaceholder.style.position = "absolute";
        this._titlePlaceholder.style.left = "0px";
        this._titlePlaceholder.style.top = "0px";
        this._titlePlaceholder.style.width = "75%";
        this._titlePlaceholder.style.height = "25%";
        this._titlePlaceholder.style.backgroundRepeat = "no-repeat";
        this._titlePlaceholder.style.backgroundSize = "contain";
        this._titlePlaceholder.style.backgroundPosition = "left";
        this._placeholder.append(this._statusPlaceholder);
        this._palettePanel = new PalettePanel(this._palettePlaceholder, this._palette);
        this._canvasPanel = new CanvasPanel(this._canvasPlaceholder, this._canvas);
    }
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
        this._statusPlaceholder.innerText = "Room didn't found";
        setTimeout(function () {
            _this._client.TryJoinRoom();
        }, 2000);
    };
    App.prototype.OnDisconnect = function () {
        var _this = this;
        this._placeholder.innerHTML = "";
        this._placeholder.append(this._statusPlaceholder);
        this._statusPlaceholder.innerText = "Unable to establish connection to hub";
        this._isDead = true;
        setTimeout(function () {
            _this.AnimateOpasity(0, 200);
        }, 2000);
        setTimeout(function () {
            _this._placeholder.innerHTML = "";
        }, 2200);
    };
    App.prototype.AnimateOpasity = function (opacity, time) {
        var _this = this;
        if (this._animationInterval !== undefined)
            clearInterval(this._animationInterval);
        opacity = Math.max(0, opacity);
        opacity = Math.min(1, opacity);
        var start = parseFloat(this._placeholder.style.opacity);
        if (isNaN(start)) {
            this._placeholder.style.opacity = '1';
            start = 1;
        }
        var step = Math.abs((start - opacity) / (time / 20));
        this._animationInterval = setInterval(function () {
            var current = parseFloat(_this._placeholder.style.opacity);
            if (start > opacity) {
                if (current > opacity)
                    current -= step;
                else
                    clearInterval(_this._animationInterval);
                _this._placeholder.style.opacity = "" + Math.max(current, opacity);
            }
            else {
                if (current < opacity)
                    current += step;
                else
                    clearInterval(_this._animationInterval);
                _this._placeholder.style.opacity = "" + Math.min(current, opacity);
            }
        }, 20);
    };
    return App;
}());
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
            if (!ignoreHistory) {
                this.History.push(new HistoryItem(x, y, color));
            }
        }
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
    function WebClient(uri, canvas) {
        var _this = this;
        this.Interval = 2500;
        this.OnBackgroundChanged = undefined;
        this.OnTitleChanged = undefined;
        this.OnConnected = undefined;
        this.OnMissingRoom = undefined;
        this.OnDisconnected = undefined;
        this._uri = uri;
        this._commands = new Commands(this);
        this.Canvas = canvas;
        Twitch.ext.onAuthorized(function (auth) {
            _this.OnAuth(auth);
        });
        this.StartTimer(function () { return _this.ProcessHistory(); });
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
    WebClient.prototype.OnAuth = function (auth) {
        this.IsAuthorized = true;
        this._auth = auth;
        this.Open();
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
    WebClient.prototype.Open = function () {
        var _this = this;
        if (this.IsAuthorized) {
            this._socket = new WebSocket(this._uri);
            this._socket.onopen = function (e) { _this.OnOpen(e); };
            this._socket.onmessage = function (e) { _this.OnMessage(e); };
            this._socket.onclose = function (e) { _this.OnClose(e); };
            this._socket.onerror = function (e) { _this.OnError(e); };
        }
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
        if (this.IsConnected) {
            this.SendMessage("joinroom " + this._auth.channelId + " " + this._jwt.user_id);
        }
    };
    WebClient.prototype.OnMessage = function (message) {
        if (typeof (message.data) === "string") {
            var commands = message.data.split("\0").filter(function (c) { return c !== ""; });
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
            this.Client.OnMissingRoom();
        }
    };
    return JoinRoomCommand;
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
        var nickname = data[0];
        var coordStr = data[1];
        var colorname = data.slice(2).join(" ");
        var coords = this.Client.Canvas.ParseCoordinate(coordStr);
        if (coords === undefined)
            return;
        var color = this.Client.Canvas.Palette.GetColorByName(colorname);
        if (color === undefined)
            return;
        this.Client.Canvas.SetPixel(coords.x, coords.y, color, true);
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
        this._width = 450;
        this._height = 450;
        this._padding = 4;
        this._mouseX = -1;
        this._mouseY = -1;
        this._isMouseDown = false;
        this._placehloder = placeholder;
        this._canvas = canvas;
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
        var itemW = Math.floor(w / (Canvas.Width + 1));
        var itemH = Math.floor(h / (Canvas.Height + 1));
        for (var iy = 0; iy < Canvas.Height; iy++) {
            for (var ix = 0; ix < Canvas.Width; ix++) {
                if (this._mouseX == ix && this._mouseY == iy)
                    this._context.fillStyle = this._canvas.Palette.GetSelectedColor().Hex;
                else
                    this._context.fillStyle = this._canvas.GetPixel(ix, iy).Hex;
                this._context.fillRect(this._padding + itemW + ix * itemW, this._padding + iy * itemH, itemW, itemH);
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
        for (var i = 0; i < Canvas.Height; i++) {
            var x = itemW * 0.65;
            var y = i * itemH + itemH * 0.75;
            var text = "" + (i + 1);
            try {
                this._context.fillText(text, x, y);
            }
            catch (ex) { }
        }
        for (var i = 0; i < Canvas.Width; i++) {
            var x = itemW * 1.65 + i * itemW;
            var y = Canvas.Height * itemH + itemH * 0.75;
            var text = this._canvas.GetVerticalCoord(i);
            try {
                this._context.fillText(text, x, y);
            }
            catch (ex) { }
        }
        this._context.lineWidth = 2;
        this._context.strokeStyle = "#FFFFFF";
        this._context.strokeRect(this._padding + itemW, this._padding, w - itemW, h - itemH);
        if (this._mouseX >= 0 && this._mouseX < Canvas.Width && this._mouseY >= 0 && this._mouseY < Canvas.Height) {
            this._context.strokeStyle = "#FFFF33";
            this._context.strokeRect(this._padding + itemW + this._mouseX * itemW, this._padding + this._mouseY * itemH, itemW, itemH);
        }
    };
    CanvasPanel.prototype.OnMouseMove = function (evt) {
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
        this._paddingPlaceholder.style.padding = "8px";
        this._paddingPlaceholder.style.top = "0px";
        this._paddingPlaceholder.style.left = "0px";
        this._paddingPlaceholder.style.bottom = "0px";
        this._paddingPlaceholder.style.right = "0px";
        this._paddingPlaceholder.style.color = "white";
        this._paddingPlaceholder.style.fontFamily = "monospace";
        this._paddingPlaceholder.style.fontSize = "12px";
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
                for (var i_1 = 0; i_1 < _this._paddingPlaceholder.children.length; i_1++) {
                    var item = _this._paddingPlaceholder.children[i_1];
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
var appDiv = document.getElementById("app");
var app = new App(appDiv, productUri);
//# sourceMappingURL=index.js.map