import React from "react";
import Grid from "./grid.js";
import ScoreBoard from "./ScoreBoard.js"
import "./App.css";
import JoinRoom from "./joinRoom.js";
import GameComponent from "./gameComponents.js";


const MainGame = () => {

  
    return (
      
        <div className="main-container">
        <GameComponent />
        <Grid />
    </div>

    );
};

export default MainGame;
