class Config
{
    private _placeholder:HTMLElement;
    private _version:string;

    private _options = 
    [
        {
            name: "string_test",
            text: "String Test",
            type: "string"
        },
        {
            name: "int_test",
            text: "Integer Test",
            type: "int",
            min: 10,
            max: 20,
            step: 5
        },
        {
            name: "float_test",
            text: "Float Test",
            type: "float",
            min: 5.5,
            max: 7.5,
            step: 0.25
        },
        {
            name: "select_test",
            text: "Select Test",
            type: "select",
            options: [
                "option1", "option2", "option3"
            ]
        }
    ];

    public constructor(placeholder:HTMLElement, version:string)
    {
        this._placeholder = placeholder;
        this._version = version;
        
        Twitch.ext.onContext((ctx, changed)=>
        {
            
        });
    }
}