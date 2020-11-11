abstract class AConfigOption
{
    public Name:string;
    public Text:string;
    public Type:ConfigOptionTypes;

   public constructor(name:string, text:string, type:ConfigOptionTypes)
   {
        this.Name = name;
        this.Text = text;
        this.Type = type;
   }

   public abstract GetElement():HTMLElement;
   public abstract OnChange(func:()=>any):void;
}
