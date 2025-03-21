import React, { useState } from "react";
import "./cell.css";

const Cell = ({ item ,setHintMessage}) => {
    const [flipped, setFlipped] = useState(false);

    
        const handleClick = async () => {
            if (item.static) return; 

            setFlipped(!flipped); 

            
            const X = Math.floor((item.id - 1) / 10); 
            const Y = (item.id - 1) % 10;
            const PlayerId = 1;

            console.log(`Sending Click Coordinates - X: ${X}, Y: ${Y}`);

            try {
                const response = await fetch("http://localhost:5024/api/game/click", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ X, Y, PlayerId }), 
                });

                const data = await response.json();
                if (data.status === "success") {
                    console.log(data.type);
                    if (data.type === "treasure") {
                        alert("🎉 You found a treasure!");
                    } else if (data.type === "hint") {
                        setHintMessage(`💡 Hint: ${data.message}`);
                    }
                } else {
                    alert("❌ Wrong move!");
                }
            } catch (error) {
                console.error("Error:", error);
            }

    };

    return (
        <div className={`cell ${flipped ? "flipped" : ""}`} onClick={handleClick}>
            <div className="cell-inner">
                <div className="cell-front">
                    {item.static ? <img src={item.img} alt="static-tile" /> : null}
                </div>
                <div className="cell-back">
                    {!item.static ? <img src={item.img} alt="tile" /> : null}
                </div>
            </div>
        </div>
    );
};

export default Cell;
