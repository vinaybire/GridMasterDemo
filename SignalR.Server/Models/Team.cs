using System.Collections.Concurrent;

namespace YourProject.Models;
public class Team
{
    public string TeamName { get; }
    public int MaxPlayers { get; }
    public int CurrentScore { get; private set; }
    public int AvailablePlayers => _players.Count;
    
    private readonly ConcurrentDictionary<string, User> _players = new();

    public Team(string teamName, int maxPlayers)
    {
        TeamName = teamName;
        MaxPlayers = maxPlayers;
    }

    public bool AddPlayer(User player)
    {
        if (AvailablePlayers >= MaxPlayers) return false;
        return _players.TryAdd(player.ConnectionId, player);
    }

    public IEnumerable<User> GetPlayers() => _players.Values;
    public User? GetPlayer(string connectionId) => 
        _players.TryGetValue(connectionId, out var player) ? player : null;
    
    public void IncrementScore() => CurrentScore++;
}