import React from "react";
import { useState, useEffect } from "react";
import Alert from "./Alert";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState(60); // Start at 60 seconds

  useEffect(() => {
    if (timeLeft === 0) return console.log("Draw a number"); // Stop when timer reaches 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]); // Runs when `timeLeft` changes

  return (
    <div
      style={{ fontFamily: "'Jersey 20', sans-serif" }}
      className="font-jersey text-2xl font-bold text-center p-4 bg-red-500 rounded-lg"
    >
      NEXT DRAW IN: {timeLeft}s
    </div>
  );
};

export default CountDown;
