/// <reference path="./node_modules/@types/twitch-ext/index.d.ts" />
/// <reference path="./Classes/App.ts" />
/// <reference path="./Classes/Config.ts" />
/// <reference path="./Classes/Models/Color.ts" />
/// <reference path="./Classes/Models/Palette.ts" />
/// <reference path="./Classes/Models/Canvas.ts" />
/// <reference path="./Classes/Models/HistoryItem.ts" />
/// <reference path="./Classes/Models/WebClient.ts" />
/// <reference path="./Classes/Models/Commands/ACommand.ts" />
/// <reference path="./Classes/Models/Commands/Commands.ts" />
/// <reference path="./Classes/Models/Commands/ClearPaletteCommand.ts" />
/// <reference path="./Classes/Models/Commands/GetBackgroudCommand.ts" />
/// <reference path="./Classes/Models/Commands/GetCanvasCommand.ts" />
/// <reference path="./Classes/Models/Commands/GetColorsCommand.ts" />
/// <reference path="./Classes/Models/Commands/GetIntervalCommand.ts" />
/// <reference path="./Classes/Models/Commands/GetTitleCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetBackroundCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetColorCommand.ts" />
/// <reference path="./Classes/Models/Commands/JoinRoomCommand.ts" />
/// <reference path="./Classes/Models/Commands/KickedCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetIntervalCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetPixelCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetTitleCommand.ts" />
/// <reference path="./Classes/View/CanvasPanel.ts" />
/// <reference path="./Classes/View/PalettePanel.ts" />

let productUri = "wss://wizquixtwitchpaint.azurewebsites.net/";
let testUri = "wss://localhost:5001";

let version = "0.0.1";

let appDiv = document.getElementById("app");
if(appDiv !== null) new App(appDiv, productUri);

let configDiv = document.getElementById("config");
if(configDiv !== null) new Config(configDiv, version);