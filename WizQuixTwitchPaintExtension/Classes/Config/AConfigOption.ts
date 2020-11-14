abstract class AConfigOption
{
     public Name:string;
     public Text:string;
     public Type:ConfigOptionTypes;
     public Default:any;

     public constructor(name:string, text:string, type:ConfigOptionTypes)
     {
          this.Name = name;
          this.Text = text;
          this.Type = type;
     }

     public SetDefault(def:any) : AConfigOption
     {
          this.Default = def;
          return this;
     }

     public abstract GetElement(value:any):HTMLElement;
     public abstract GetValue():any;
     public abstract IsValueValid():boolean;
     public abstract GetErrorText():string;
}
