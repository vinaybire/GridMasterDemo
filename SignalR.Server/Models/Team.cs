using System.Collections.Concurrent;

public class Team
{

    public string TeamName;

    public  Dictionary<string,User> TeamPlayers = new();
    //public List<User>  TeamPlayers = new List<User>();
    public int TotalPlayers {get;set;}

    public int CurrentScore=0;

    public  int AvilabePlayers =0;
    
    public Team(int totalPlayers){
        TotalPlayers=totalPlayers;
    }

    public void AddPlayer(string connectionId,User player){
        TeamPlayers[connectionId]=player;
    }
}