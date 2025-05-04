"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
const ROUND_TIMEOUT = 90;

const Timer = () => {
  const { resetTimer } = useSocket();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (resetTimer) {
      setTimeLeft(ROUND_TIMEOUT);
    }
  }, [resetTimer]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <p
      style={{
        textShadow: "0 0 10px #8b5cf6, 0 2px 6px #8b5cf6",
      }}
      className="font-bold text-violet-100 text-2xl uppercase tracking-widest"
    >
      {formatTime(timeLeft)}
    </p>
  );
};

export default Timer;
