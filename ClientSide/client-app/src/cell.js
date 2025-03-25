import React, { useState ,useContext} from "react";
import "./cell.css";
import * as signalR from "@microsoft/signalr";
import userName from "./joinRoom"
// import { SignalRContext } from "./signalRContext";
import { connection } from "./signalRContext";

const Cell = ({ item ,setHintMessage}) => {
    const [flipped, setFlipped] = useState(false);
    const userName = localStorage.getItem("userName");
    
        const handleClick = async () => {
            if (item.static) return; 

            setFlipped(!flipped); 

            
            const X = Math.floor((item.id - 1) / 10); 
            const Y = (item.id - 1) % 10;
            const PlayerId = 1;

            console.log(`Sending Click Coordinates - X: ${X}, Y: ${Y}`);


            connection.invoke("Move", userName, X, Y)
            .then(() => {
                console.log(`Move sent successfully!`);
            })
            .catch(function (err) {
                console.error("Error sending move:", err.toString());
                console.error(userName);
            });

        
        

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
