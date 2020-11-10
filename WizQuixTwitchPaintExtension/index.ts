/// <reference path="./node_modules/@types/twitch-ext/index.d.ts" />
/// <reference path="./Classes/App.ts" />
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
/// <reference path="./Classes/Models/Commands/GetTitleCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetBackroundCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetColorCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetMeCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetPixelCommand.ts" />
/// <reference path="./Classes/Models/Commands/SetTitleCommand.ts" />
/// <reference path="./Classes/View/CanvasPanel.ts" />
/// <reference path="./Classes/View/PalettePanel.ts" />

let productUri = "wss://wizquixtwitchpaint.azurewebsites.net/";
let testUri = "wss://localhost:5001";

let appDiv = document.getElementById("app");
let app:App = new App(appDiv, testUri);