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

        public abstract Task Execute(string[] args);
    }
}
