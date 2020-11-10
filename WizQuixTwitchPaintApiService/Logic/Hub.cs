using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Threading.Tasks;
using WizQuixTwitchPaintApiService.Logic.Commands;

namespace WizQuixTwitchPaintApiService.Logic
{
    public static class Hub
    {
        public const string TWITCH_ID_URI = "https://id.twitch.tv/oauth2/token";
        public const string TWITCH_API_URI = "https://api.twitch.tv/helix/";
        private const string FILENAME = "settings.json";

        private static string TwitchToken = null;
        private static DateTime TwitchTokenExpires;
        public static string TwitchClientId = "";
        private static string TwitchSecret = "";

        public static ConcurrentDictionary<int, Room> Rooms { get; private set; } = new ConcurrentDictionary<int, Room>();

        static Hub()
        {
            Load();
        }

        public static async Task ProcessClient(WebClient client)
        {
            client.InitIdentification();
            await client.Run();
        }

        public static async Task<(bool status, WebClient.HttpCodes code, string reason)> CreateRoom(WebClient client)
        {
            if (client.IsBroadcaster)
            {
                if (Rooms.ContainsKey(client.Channel.Id))
                {
                    if (Rooms[client.Channel.Id].Broadcaster.CheckConnection())
                        return (false, WebClient.HttpCodes.Code409, $"Room '{client.Channel.Login}' already exists.");
                    else await RemoveRoom(client.Channel.Id);
                }

                var room = new Room(client);
                Rooms.TryAdd(client.Channel.Id, room);

                return (true, WebClient.HttpCodes.Code200, "");
            }
            else return (false, WebClient.HttpCodes.Code401, "Client not a broadcaster");
        }

        public static (bool status, WebClient.HttpCodes code, string reason) JoinRoom(WebClient client)
        {
            if (!client.IsBroadcaster)
            {
                if (!Rooms.ContainsKey(client.Channel.Id))
                    return (false, WebClient.HttpCodes.Code404, $"Room '{client.Channel.Login}' didn't exists.");

                var success = Rooms[client.Channel.Id].AddViewer(client);

                if (success) return (true, WebClient.HttpCodes.Code200, "");
                else return (false, WebClient.HttpCodes.Code500, "");
            }
            else return (false, WebClient.HttpCodes.Code401, "Client not a viewer");
        }

        public static async Task RemoveRoom(int id)
        {
            Rooms.TryRemove(id, out var removedRoom);
            await removedRoom.KickAll();
        }

        public static async Task<string> GetToken()
        {
            if (string.IsNullOrWhiteSpace(TwitchToken) || TwitchTokenExpires < DateTime.Now)
                await UpdateToken();
            return TwitchToken;
        }

        private static async Task UpdateToken()
        {
            using (HttpClient http = new HttpClient())
            using (var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", TwitchClientId),
                new KeyValuePair<string, string>("client_secret", TwitchSecret),
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("scope", "")
            }))
            {
                var result = await http.PostAsync(TWITCH_ID_URI, content);
                var json = await result.Content.ReadAsStringAsync();

                dynamic auth = JsonConvert.DeserializeObject<dynamic>(json);

                try
                {
                    string token = auth.access_token;
                    int expiresIn = auth.expires_in;

                    TwitchToken = token;
                    TwitchTokenExpires = DateTime.Now + TimeSpan.FromSeconds(expiresIn - 60);

                    await Save();
                }
                catch { }
            }
        }

        private static async Task Save()
        {
            dynamic obj = new ExpandoObject();
            obj.token = TwitchToken;
            obj.expiresIn = TwitchTokenExpires;
            obj.twitchClientId = TwitchClientId;
            obj.twitchSecret = TwitchSecret;
            string json = JsonConvert.SerializeObject(obj);
            await File.WriteAllTextAsync(FILENAME, json);
        }

        private static void Load()
        {
            if(File.Exists(FILENAME))
            {
                string json = File.ReadAllText(FILENAME);
                dynamic obj = JsonConvert.DeserializeObject(json);
                try
                {
                    string token = obj.token;
                    DateTime expiresIn = obj.expiresIn;
                    string twitchClientId = obj.twitchClientId;
                    string twitchSecret = obj.twitchSecret;

                    TwitchToken = token;
                    TwitchTokenExpires = expiresIn;
                    TwitchClientId = twitchClientId;
                    TwitchSecret = twitchSecret;
                }
                catch { }
            }
            else
            {
                Task.Run(async ()=>
                {
                    await Save();
                });
            }
        }
    }
}
