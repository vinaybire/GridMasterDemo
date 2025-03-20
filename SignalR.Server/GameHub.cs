using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;

// Record to store user info




// Record to store message data
public record Message(string User, string Text);



public class GameHub : Hub
{
    private static TeamManager teamManager = new();
    private HintManager hintManager = new();
    private static ConcurrentDictionary<string, User> _users = new();
    private static ConcurrentDictionary<string, string> idTeam = new();
    public int numberOfUser = _users.Count();
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_users.TryRemove(Context.ConnectionId, out var user))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.Room);
            await Clients.Group(user.Room).SendAsync("UserLeft", user.Name);
        }
    }

    public async Task JoinRoom(string userName, string roomName, string teamName)
    {
        Console.WriteLine(numberOfUser);
        //_users.TryAdd(Context.ConnectionId, new User(userName, Context.ConnectionId, roomName));
        //User u1 = new User();


        teamManager.managePlayer(userName, teamName, Context.ConnectionId);
        TeamManager.Teams.TryGetValue(teamName, out var team);

        //Console.WriteLine(team.TeamPlayers[0].Name);
        idTeam[Context.ConnectionId] = teamName;
        await SendMessageToTeam(roomName, teamName, userName + " joined room");
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        // await Clients.Group(roomName).SendAsync("UserJoined", userName);
    }

    public async Task SendMessageToTeam(string roomName, string teamName, string content)
    {
        TeamManager.Teams.TryGetValue(teamName, out var team);

        foreach (User player in team.TeamPlayers.Values)
        {
            //Console.WriteLine("F" + player.Name);
            await Clients.Client(player.ConnectionId).SendAsync("MoveAcknowledged", content);
        }
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

        var teamName = idTeam[Context.ConnectionId];
        Console.WriteLine(teamName);


        TeamManager.Teams.TryGetValue(teamName, out var team);

        User player = team.TeamPlayers[Context.ConnectionId];

        if (player.Chance > 0)
        {
            /* */
            string moveMessage;

            if (hintManager.TryGetHint(player.Id, player.TotalHintFound, out var value))
                {
                    if (value.Matches(x, y, out string hintText))
                    {
                        player.Chance = 2;
                        player.TotalHintFound++;
                        if(player.TotalHintFound==3){
                            moveMessage = $"{userName} found Tresure";    
                        }
                        else moveMessage = $"{userName} Hint : {hintText} ";
                    }
                    else
                    {
                        moveMessage = $"{userName} not found hit ({x}, {y})";
                    }
                
                    //await SendMessageToTeam("",teamName,moveMessage);

                    //await Clients.Group(roomName).SendAsync("MoveAcknowledged", moveMessage);

                }
            else
            {
                player.Chance--;
                moveMessage = "Wrong";
            }

            await SendMessageToTeam("",teamName,moveMessage);
            
            if (team.CurrentScore == team.TotalPlayers)
            {
                moveMessage = teamName+" Won!!";
                await SendMessageToTeam("",teamName,moveMessage);
                //await Clients.Client(players.ConnectionId).SendAsync("UserJoined",content);
            }
            
        }



        /*if (_users.TryGetValue(Context.ConnectionId, out var user))
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
                    if (value == (x, y))
                    {
                        user.Chance = 2;
                        user.TotalHintFound++;
                        if (user.TotalHintFound == 3)
                        {
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
        }*/
    }
}
