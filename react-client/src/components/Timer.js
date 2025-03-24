import React from "react";

const Timer = ({ time }) => {
  return (
    <div className="timer-container">
      <h2>Timer</h2>
      <div className="timer-box">{time}</div>
    </div>
  );
};

export default Timer;
