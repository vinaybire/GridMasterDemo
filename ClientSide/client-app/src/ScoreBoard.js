import React, { useEffect, useState } from "react";
import "./ScoreBoard.css";

const ScoreBoard = () => {
    const [scores, setScores] = useState([]);

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
        const interval = setInterval(fetchScores, 5000); // Auto-update every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>🏆 Scoreboard</h3>
            <ul style={styles.list}>
                {scores.map((player) => (
                    <li key={player.id} style={styles.item}>
                        {player.name}: <strong>{player.score}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        position: "absolute",
        top: "83px",
        left: "40px",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        width: "400px",
        height:"300px",

    },
    title: {
        margin: "0",
        paddingBottom: "5px",
        textAlign: "center",
        fontSize: "25px",
        borderBottom: "2px solid white",
    },
    list: {
        listStyle: "none",
        padding: "20px",
        margin: "10px 0 0",
        fontSize: "25px",

    },
    item: {
        fontSize: "14px",
        margin: "5px 0",
        fontSize: "25px",
        textAlign: "center",
    },
};



export default ScoreBoard;
