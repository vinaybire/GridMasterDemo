namespace YourProject.Models;
public class User
{
    public string Name { get; }
    public string ConnectionId { get; }
    public string TeamName { get; }
    public int Id { get; }
    public int Chance { get; private set; }
    public int TotalHintsFound { get; private set; }
    public string RoomName { get; }

    public User(string name, string connectionId, string teamName, int id, string roomName)
    {
        Name = name;
        ConnectionId = connectionId;
        TeamName = teamName;
        Id = id;
        RoomName = roomName;
        Chance = GameConstants.InitialChances;
    }

    public void ResetChances() => Chance = GameConstants.InitialChances;
    public void DecrementChance() => Chance--;
    public void IncrementHintsFound() => TotalHintsFound++;
}