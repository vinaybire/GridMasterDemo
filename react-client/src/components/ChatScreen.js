import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import GameGrid from "./GameGrid";
import Timer from "./Timer";

const ChatScreen = ({ userName, roomName }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5008/gameHub", {
        withCredentials: true, // Optional if using credentials
        skipNegotiation: true, // Optional, depending on transport
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");
        newConnection.invoke("JoinRoom", userName, roomName, "Team");
        newConnection.invoke("StartTimer", roomName);
      })
      .catch((err) => console.error("Connection failed: ", err));

    newConnection.on("ReceiveMessage", (msg) => {
      setMessages((prev) => [...prev, `${msg.user}: ${msg.text}`]);
    });

    newConnection.on("UpdateTimer", (timeLeft) => {
      setTimer(timeLeft);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [userName, roomName]);

  const sendMessage = () => {
    if (messageInput && connection) {
      connection.invoke("SendMessageToRoom", roomName, messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="chat-container">
      <h1>Room: {roomName}</h1>
      <Timer time={timer} />
      <div className="message-box">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <GameGrid userName={userName} connection={connection} />
    </div>
  );
};

export default ChatScreen;
