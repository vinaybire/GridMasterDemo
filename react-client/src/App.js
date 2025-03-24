import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import ChatScreen from "./components/ChatScreen";
import "./styles.css";

function App() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="app-container">
      {!isJoined ? (
        <HomeScreen
          setUserName={setUserName}
          setRoomName={setRoomName}
          setTeamName={setTeamName}
          setIsJoined={setIsJoined}
        />
      ) : (
        <ChatScreen userName={userName} roomName={roomName} />
      )}
    </div>
  );
}

export default App;
