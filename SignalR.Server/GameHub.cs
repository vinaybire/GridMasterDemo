using System.Collections.Concurrent;
using System.Numerics;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;





public record Message(string User, string Text);


public class GameResult
{
    public List<int> Scores { get; set; } = new List<int>();
    public string Winner { get; set; }
}

public class GameHub : Hub
{
    private static TeamManager teamManager = new();
    private HintManager hintManager = new();
    private static bool TimeOver = false;

    private static ConcurrentDictionary<string, string> idTeam = new();

    public async Task JoinRoom(string userName, string roomName, string teamName)
    {

        teamManager.managePlayer(userName, teamName, Context.ConnectionId, roomName);
        TeamManager.Teams.TryGetValue(teamName, out var team);

        idTeam[Context.ConnectionId] = teamName;
        await SendMessageToTeam(roomName, teamName, userName + " joined room");
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        Console.WriteLine(teamManager.TotalPlayers);
    }


    private static Dictionary<string, int> roomTimers = new();

    public async Task StartTimer(string roomName)

    {
        if (teamManager.TotalPlayers == 2)

        {
            if (roomTimers.ContainsKey(roomName)) return;

            roomTimers[roomName] = 60;

            while (roomTimers[roomName] >= 0)
            {
                if (roomTimers[roomName] == 0)
                {
                    TimeOver = true;
                    Console.WriteLine(TimeOver);
                }

                //Console.WriteLine(roomTimers[roomName]);

                int minutes = roomTimers[roomName] / 60;
                int seconds = roomTimers[roomName] % 60;
                string timeFormatted = $"{minutes:D2}:{seconds:D2}";
                await Clients.Group(roomName).SendAsync("UpdateTimer", timeFormatted);
                await Task.Delay(1000);
                roomTimers[roomName]--;

            }
            await Clients.Group(roomName).SendAsync("TimerEnded", "Time is up!");
            roomTimers.Remove(roomName);
        }

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

    public async Task GetGameResults(string roomName)
    {
        Console.WriteLine("result called");
        GameResult obj = new();
        int ind = 0, maxScore = 0;

        foreach (Team team in TeamManager.Teams.Values)
        {

            obj.Scores.Add(team.CurrentScore);
            Console.WriteLine(team.CurrentScore);
            //Console.WriteLine("F" + player.Name);
            //await Clients.Client(player.ConnectionId).SendAsync("MoveAcknowledged", content);
        }
        ind = 0;
        for (int i = 0; i < obj.Scores.Count; i++)
        {
            if (obj.Scores[i] > maxScore)
            {
                ind = i;
                maxScore = obj.Scores[i];
            }
        }
        obj.Winner = $"Winner is team {ind + 1}";
        await Clients.Group(roomName).SendAsync("GameResults", obj);
    }

    public async Task SendMessageToRoom(string roomName, string content)
    {
        await Clients.Group(roomName).SendAsync("ReceiveMessage", content);
    }



    public async Task Move(string userName, int x, int y)
    {

        var teamName = idTeam[Context.ConnectionId];
        Console.WriteLine(teamName);


        TeamManager.Teams.TryGetValue(teamName, out var team);

        User player = team.TeamPlayers[Context.ConnectionId];

        string roomName = player.RoomName;
        string moveMessage = "";
        if (TimeOver == true)
        {
            moveMessage = "Time is over ";
            await Clients.Group(roomName).SendAsync("MoveAcknowledged", moveMessage);
            return;
        }
        else
        {

            if (player.Chance > 0)
            {
                //Console.WriteLine(player.Chance);
                Console.WriteLine(userName);
                Console.WriteLine(x);
                Console.WriteLine(y);

                if (hintManager.TryGetHint(player.Id, player.TotalHintFound, out var value))
                {
                    if (value.Matches(x, y, out string hintText))
                    {
                        player.Chance = 2;
                        player.TotalHintFound++;
                        if (player.TotalHintFound == 3)
                        {
                            team.CurrentScore++;
                            moveMessage = $"{userName} found Tresure";
                        }
                        else moveMessage = $"{userName} Hint : {hintText} ";
                    }
                    else
                    {
                        player.Chance--;
                        moveMessage = $"{userName} not found hint ({x}, {y})";
                    }
                }


                await SendMessageToTeam("", teamName, moveMessage);

                if (team.CurrentScore == 1)
                {
                    moveMessage = teamName + " Won!!";
                    await SendMessageToRoom(teamName, moveMessage);
                    await GetGameResults(roomName);


                    //await Clients.Client(players.ConnectionId).SendAsync("UserJoined",content);
                }
            }
            else
            {

                moveMessage = $"{userName}  has no chance";
                await Clients.Client(Context.ConnectionId).SendAsync("MoveAcknowledged", moveMessage);
            }
        }
    }

}
