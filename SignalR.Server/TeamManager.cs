using System.Collections.Concurrent;

class TeamManager
{
    public static ConcurrentDictionary<string, Team> Teams = new();

    public void managePlayer(string userName, string teamName, string connectionId)
    {
        if (!Teams.ContainsKey(teamName))
        {
            Teams.TryAdd(teamName, new Team(2));
        }

        if (Teams[teamName].AvilabePlayers < 2)
        {
            User user = new User(userName, connectionId, teamName, Teams[teamName].AvilabePlayers);
            Teams[teamName].AvilabePlayers++;
            Teams[teamName].AddPlayer(connectionId, user);
        }

        else
        {
            Console.WriteLine("Full");
        }
    }
}