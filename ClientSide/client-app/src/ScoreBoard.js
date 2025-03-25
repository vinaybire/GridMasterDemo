import React, { useEffect, useState, useContext } from "react";
import "./ScoreBoard.css";
import { SignalRProvider } from "./signalRContext";

const ScoreBoard = () => {
    const [scores, setScores] = useState([]);
    // const connection = useContext(SignalRContext);
    

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch("http://localhost:5024/api/game/scores");
                const data = await response.json();
                setScores(data);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 5000);

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="container">
            <h3 className="title">🏆 Scoreboard</h3>
            <ul className="list">
                {scores.map((player) => (
                    <li key={player.id} className="item">
                        {player.name}: <strong>{player.score}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};


    




export default ScoreBoard;
