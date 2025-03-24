import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const GameApp = () => {
  const [connection, setConnection] = useState(null);
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [messages, setMessages] = useState([]);
  const [timer, setTimer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [grid, setGrid] = useState([]);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5008/gameHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Start SignalR connection
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR");

          // Listen for incoming events
          connection.on("ReceiveMessage", (msg) => {
            addMessage(`${msg.user}: ${msg.text}`);
          });

          connection.on("UserJoined", (msg) => {
            addMessage(`${msg} has joined the room.`, "grey");
          });

          connection.on("UserLeft", (msg) => {
            addMessage(`${msg} has left the room.`, "grey");
          });

          connection.on("MoveAcknowledged", (msg) => {
            addMessage(msg, "green");
          });

          connection.on("UpdateTimer", (timeLeft) => {
            setTimer(timeLeft);
          });

          connection.on("TimerEnded", (msg) => {
            setTimer(msg);
          });
        })
        .catch((err) => console.error("Connection failed:", err));
    }
  }, [connection]);

  // Auto-scroll chat to the bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add message to chat
  const addMessage = (msg, color = "black") => {
    setMessages((prev) => [
      ...prev,
      <p key={prev.length} style={{ color }}>
        {msg}
      </p>,
    ]);
  };

  // Handle joining room
  const joinRoom = async () => {
    if (!userName || !roomName || !teamName) {
      alert("Please enter username, room name, and team name.");
      return;
    }

    try {
      await connection.invoke("JoinRoom", userName, roomName, teamName);
      await connection.invoke("StartTimer", roomName);
      createGrid();
      setShowChat(true);
    } catch (err) {
      console.error("Error joining room:", err.toString());
    }
  };

  // Send message to the room
  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      const message = messageInputRef.current.value;
      if (message.trim() && connection) {
        await connection.invoke("SendMessageToRoom", roomName, message);
        messageInputRef.current.value = "";
      }
    }
  };

  // Handle cell click for movement
  const move = async (x, y) => {
    try {
      await connection.invoke("Move", userName, x, y);
    } catch (err) {
      console.error("Error sending move:", err.toString());
    }
  };

  // Create game grid
  const createGrid = () => {
    const gridSize = 10;
    const newGrid = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        newGrid.push({ x, y });
      }
    }
    setGrid(newGrid);
  };

  // Render chat and game UI after joining
  if (showChat) {
    return (
      <div style={{ fontFamily: "Roboto, serif", padding: "20px" }}>
        <h1>Room: {roomName}</h1>

        {/* Chat Box */}
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            height: "200px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
        >
          {messages}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}
        <input
          ref={messageInputRef}
          type="text"
          placeholder="Type a message"
          onKeyUp={sendMessage}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        {/* Timer Display */}
        <div id="timespace" style={{ marginBottom: "20px" }}>
          <h2>Timer</h2>
          <div
            style={{
              border: "1px solid black",
              width: "90px",
              height: "40px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {timer !== null ? timer : "--"}
          </div>
        </div>

        {/* Game Grid */}
        <h3>Game Grid</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 40px)",
            gap: "5px",
          }}
        >
          {grid.map((cell, index) => (
            <div
              key={index}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => move(cell.x, cell.y)}
            >
              ({cell.x}, {cell.y})
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Initial join screen
  return (
    <div style={{ fontFamily: "Roboto, serif", padding: "20px" }}>
      <h1>SignalR Client</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          id="userName"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          id="roomName"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="text"
          id="teamName"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default GameApp;
