import React from "react";
import Grid from "./grid.js";
import ScoreBoard from "./ScoreBoard.js"
import "./App.css";
import JoinRoom from "./joinRoom.js";
import MainGame from "./mainGame.js";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { startConnection } from "./signalRContext";
// import { SignalRProvider } from "./signalRContext";

const App = () => {
    useEffect(() => {
        startConnection();
      }, []);

    return (
        
            <Router>
                <Routes>
                    <Route path="/" element={<JoinRoom />} />
                    <Route path="/game" element={<MainGame />} />
                </Routes>
            </Router>
       
    );
  
  }

export default App;
