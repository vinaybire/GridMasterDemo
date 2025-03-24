import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
// import { SignalRContext } from "./signalRContext";
import { connection } from "./signalRContext";

const JoinRoom = () => {
    const [userName, setUserName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [teamName, setTeamName] = useState("");

    // const connection = useContext(SignalRContext);

    const navigate = useNavigate();

    // connection.start().catch(function (err) 
    //     return console.error(err.toString());
    // });

    localStorage.setItem("userName", userName);


    const handleJoin = () => {
        if (!userName || !roomName || !teamName) {
            alert("Please enter all details");
            return;
        }

        
        navigate("/game");

        connection.invoke("JoinRoom", userName, roomName, teamName)
            .catch(function (err) {
                console.error(err.toString());
            });

            connection.invoke("StartTimer", roomName)
            .catch(function (err) {
                console.error(err.toString());
            });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <h1>SignalR Client</h1>
            <input 
                type="text" 
                placeholder="Username" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Room" 
                value={roomName} 
                onChange={(e) => setRoomName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Team Name" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
            />
            <button id="joinRoom" onClick={handleJoin}>Join Room</button>
        </div>
    );
};

export default JoinRoom;
