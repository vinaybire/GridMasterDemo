import React, { useState, useEffect } from "react";
import "./gamecomponent.css"; // Import CSS for styling
import { connection } from "./signalRContext";

const GameComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const handleMoveAcknowledged = (msg) => {
      console.log(msg + "cc");
      setMessages((prev) => [...prev, { text: msg, color: "black" }]);
    };

    const handleUserJoined = (msg) => {
      setMessages((prev) => [...prev, { text: `${msg} has joined.`, color: "grey" }]);
    };

    const handleUserLeft = (msg) => {
      setMessages((prev) => [...prev, { text: `${msg} has left.`, color: "grey" }]);
    };

    const handleUpdateTimer = (time) => {
      setTimeLeft(time);
    };

  
    connection.on("MoveAcknowledged", handleMoveAcknowledged);
    connection.on("UserJoined", handleUserJoined);
    connection.on("UserLeft", handleUserLeft);
    connection.on("UpdateTimer", handleUpdateTimer);

    
    return () => {
      connection.off("MoveAcknowledged", handleMoveAcknowledged);
      connection.off("UserJoined", handleUserJoined);
      connection.off("UserLeft", handleUserLeft);
      connection.off("UpdateTimer", handleUpdateTimer);
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    connection.invoke("SendMessage", message).catch((err) => console.error(err.toString()));
    setMessage(""); 
  };

  return (
    <div className="chat-screen">
      <h1 id="roomTitle">Room Title</h1>

     
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.color }}>{msg.text}</p>
        ))}
      </div>

   
      <div>
        <input
          type="text"
          placeholder="Message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      
      <div id="timespace">
        <h2>Timer</h2>
        <div id="time">{timeLeft}</div>
      </div>
    </div>
  );
};

export default GameComponent;
