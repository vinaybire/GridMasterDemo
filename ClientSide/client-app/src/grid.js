import React, { useState, useEffect } from "react";
import Cell from "./cell";
import Sdata from "./data.js";
import "./grid.css";
import { connection } from "./signalRContext"; // Import SignalR connection

const gridSize = 10;
const totalCells = gridSize * gridSize;

const getIndex = (x, y) => (x - 1) * gridSize + (y - 1);

const staticElements = new Map(Sdata.map(({ x, y, img }) => [getIndex(x, y), img]));

const Grid = () => {
    const [hints, setHints] = useState(["", "", ""]); // Array to hold hints for 3 players

    // Listen for MoveAcknowledged to update hints dynamically
    useEffect(() => {
        const handleMoveAcknowledged = (msg, id) => {
            console.log(`Received hint for Player ${id}: ${msg}`);

            setHints((prevHints) => {
                const updatedHints = [...prevHints];
                if (id >= 0 && id <= 2) {
                    updatedHints[id] = msg; // Update the corresponding hint by id
                }
                return updatedHints;
            });
        };

        // Subscribe to SignalR event
        connection.on("HintAcknowledged", handleMoveAcknowledged);

        return () => {
            // Unsubscribe on component unmount
            connection.off("HintAcknowledged", handleMoveAcknowledged);
        };
    }, []);

    const data = Array.from({ length: totalCells }, (_, index) => {
        const img = staticElements.get(index) || "https://i.pinimg.com/736x/21/b6/f6/21b6f6ce8caadcdc0c243ebe8a0fccce.jpg";

        return {
            id: index + 1,
            image: img,
            static: staticElements.has(index),
        };
    });

    return (
        <div className="grid-container">
            <div className="grid">
                {data.map((item) => (
                    <Cell key={item.id} item={item} />
                ))
                }
            </div>

            {/* Hint Box Below Grid */}
            <div className="hint-box">
                {hints.map((hint, index) => (
                    <div key={index} id={`hint-${index + 1}`}>
                        <h3>Hint For Player {index + 1}</h3>
                        <p>{hint || "Waiting for hint..."}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
