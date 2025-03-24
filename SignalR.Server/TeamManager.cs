using System.Collections.Concurrent;

class TeamManager
{
    public static ConcurrentDictionary<string, Team> Teams = new();
     public  int TotalPlayers=0;

    public void managePlayer(string userName, string teamName, string connectionId, string roomName)
    {
        if (!Teams.ContainsKey(teamName))
        {
            Teams.TryAdd(teamName, new Team(1));
        }

        if (Teams[teamName].AvilabePlayers < 1)
        {
            TotalPlayers++;
            User user = new User(userName, connectionId, teamName, Teams[teamName].AvilabePlayers , roomName);
            Teams[teamName].AvilabePlayers++;
            Teams[teamName].AddPlayer(connectionId, user);
        }

        else
        {
            Console.WriteLine("Full");
        }
    }
}