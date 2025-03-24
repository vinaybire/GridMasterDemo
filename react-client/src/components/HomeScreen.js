import React, { useState } from "react";
import * as signalR from "@microsoft/signalr";

const HomeScreen = ({ setUserName, setRoomName, setTeamName, setIsJoined }) => {
  const [localUserName, setLocalUserName] = useState("");
  const [localRoomName, setLocalRoomName] = useState("");
  const [localTeamName, setLocalTeamName] = useState("");

  const handleJoinRoom = async () => {
    if (!localUserName || !localRoomName || !localTeamName) {
      alert("Please enter all fields!");
      return;
    }

    setUserName(localUserName);
    setRoomName(localRoomName);
    setTeamName(localTeamName);
    setIsJoined(true);
  };

  return (
    <div className="home-container">
      <h1>SignalR Client</h1>
      <input
        type="text"
        placeholder="Username"
        value={localUserName}
        onChange={(e) => setLocalUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room"
        value={localRoomName}
        onChange={(e) => setLocalRoomName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Team Name"
        value={localTeamName}
        onChange={(e) => setLocalTeamName(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default HomeScreen;
