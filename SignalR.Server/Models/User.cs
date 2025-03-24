public class User
{
    public string Name { get; set; }
    public int Id { get; set; }
    public string ConnectionId {get;set;}
    public string TeamName { get; set; }
    public int Chance { get; set; }
    public int TotalHintFound { get; set; }
    public string RoomName { get; internal set; }

    public User(string name, string connectionId, string teamName,int id, string roomName)
    {
        Name = name;
        ConnectionId = connectionId;
        TeamName = teamName;
        Id=id;
        Chance = 2;
        TotalHintFound = 0;
        RoomName = roomName;
    }
}