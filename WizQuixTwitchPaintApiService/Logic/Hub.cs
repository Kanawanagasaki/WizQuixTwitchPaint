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
            await client.Identify();
            if (!client.IsIdentified)
            {
                await client.SendMessage("error setme 401 Identify error. Use 'setme <{broadcaster|viewer}> <{channelid:int|channelname:string}> [<{userid:int|username:string}>]'.");
                await client.Close();
                return;
            }
            if(client.IsBroadcaster)
            {
                if (Rooms.ContainsKey(client.Channel.Id))
                {
                    await client.SendMessage($"error setme 409 Room '{client.Channel.Login}' already exists.");
                    await client.Close();
                    return;
                }

                var room = new Room(client);
                Rooms.TryAdd(client.Channel.Id, room);

                await client.SendMessage($"info setme OK");

                client.Init();
                client.JoinedRoom = room;

                client.OnConnectionClose += Client_OnConnectionClose;
            }
            else
            {
                if (!Rooms.ContainsKey(client.Channel.Id))
                {
                    await client.SendMessage($"error setme 404 Room '{client.Channel.Login}' didn't exists.");
                    await client.Close();
                    return;
                }

                Rooms[client.Channel.Id].AddViewer(client);

                await client.SendMessage($"info setme OK");

                client.Init();
                client.JoinedRoom = Rooms[client.Channel.Id];
            }
            await client.Run();
        }

        private static void Client_OnConnectionClose(WebClient client)
        {
            Rooms.TryRemove(client.Channel.Id, out var room);
            room.KickAll();
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
                Save();
            }
        }
    }
}
