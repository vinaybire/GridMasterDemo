import React, { useState } from "react";
import Cell from "./cell";
import Sdata from "./data.js";
import "./grid.css";

const gridSize = 10;
const totalCells = gridSize * gridSize;

const getIndex = (x, y) => (x - 1) * gridSize + (y - 1);

const staticElements = new Map(Sdata.map(({ x, y, img }) => [getIndex(x, y), img]));

const Grid = () => {
    const [hintMessage, setHintMessage] = useState("");

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
                    <Cell key={item.id} item={item} setHintMessage={setHintMessage} />
                ))}
            </div>

            {/* Hint Box Below Grid */}
            {hintMessage && (
                <div className="hint-box">
                    <div><h3> Hint For Player 1</h3>
                        <p>{hintMessage}</p>
                    </div> 
                    <div><h3> Hint For Player 1</h3>
                        <p>{hintMessage}</p>
                    </div> 
                    <div><h3> Hint For Player 1</h3>
                        <p>{hintMessage}</p>
                    </div> 
                    
                </div>
            )}
            

        </div>
    );
};

export default Grid;
