using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WizQuixTwitchPaintApiService.Logic.Commands
{
    public abstract class ACommand
    {
        public string Name { get; private set; }
        protected WebClient Client;

        public ACommand(string name, WebClient client)
        {
            Name = name.ToLower();
            Client = client;
        }

        public async Task SendInfo(string text = "OK")
        {
            await Client.SendInfo(Name, text);
        }

        public async Task SendError(WebClient.HttpCodes code, string reason)
        {
            await Client.SendError(Name, code, reason);
        }

        public abstract Task Execute(string[] args);
    }
}
