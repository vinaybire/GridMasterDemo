using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;

// Record to store user info
public class User
{
    public string Name { get; set; }
    public int Id { get; set; }
    public string Room { get; set; }
    public int Chance { get; set; }
    public int TotalHintFound { get; set; }

    public User(string name, int id, string room, int chance, int totalHintFound)
    {
        Name = name;
        Id = id;
        Room = room;
        Chance = chance;
        TotalHintFound = totalHintFound;
    }
}



// Record to store message data
public record Message(string User, string Text);



public class AdvancedChatHub : Hub
{
    public Dictionary<(int, int), (int, int)> hints = new(){
         { (0, 0), (1, 1) },
         { (0, 1), (2, 2) },
         { (0, 2), (3, 3) },
         { (1, 0), (9, 0) },
         { (1, 1), (9, 1) },
         { (1, 2), (9, 2) },
         { (2, 0), (7, 7) },
         { (2, 1), (8, 8) },
         { (2, 2), (9, 9) },

    };
    //dataStruct[(1, 2)] = (4, 5);  // Adds or updates the value at key (1, 2)
    private static ConcurrentDictionary<string, User> _users = new();
    public int numberOfUser = _users.Count();
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_users.TryRemove(Context.ConnectionId, out var user))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.Room);
            await Clients.Group(user.Room).SendAsync("UserLeft", user.Name);
        }
    }

    public async Task JoinRoom(string userName, string roomName)
    {
        Console.WriteLine(numberOfUser);
        _users.TryAdd(Context.ConnectionId, new User(userName, numberOfUser, roomName, 2, 0));
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        await Clients.Group(roomName).SendAsync("UserJoined", userName);

    }

    public async Task SendMessageToRoom(string roomName, string content)
    {
        if (_users.TryGetValue(Context.ConnectionId, out var user))
        {
            var message = new Message(user.Name, content);
            await Clients.Group(roomName).SendAsync("ReceiveMessage", message);
        }
    }

    public async Task Move(string userName, int x, int y)
    {
        if (_users.TryGetValue(Context.ConnectionId, out var user))
        {
            string roomName = user.Room;
            string moveMessage = "";

            if (user.Chance == 0)
            {
                moveMessage = $"{userName}  has no chance";
                await Clients.Client(Context.ConnectionId).SendAsync("MoveAcknowledged", moveMessage);
            }
            else
            {
                user.Chance--;

                if (hints.TryGetValue((user.Id, user.TotalHintFound), out var value))
                {
                    if (value == (x,y))
                    {
                        user.Chance = 2;
                        user.TotalHintFound++;
                        if(user.TotalHintFound==3){
                            moveMessage = $"{userName} found Tresure";    
                        }
                        else moveMessage = $"{userName} found hint ({x}, {y})";
                    }
                    else
                    {
                        moveMessage = $"{userName} not found hit ({x}, {y})";
                    }

                    await Clients.Group(roomName).SendAsync("MoveAcknowledged", moveMessage);

                }

            }
        }
    }
}
