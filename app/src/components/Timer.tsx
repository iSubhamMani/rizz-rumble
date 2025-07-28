"use client";

import { useSocket } from "@/context/SocketContext";
import { Clock } from "lucide-react";
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
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1">
        <Clock className="h-4 w-4 text-orange-400" />
        <span className="text-lg md:text-xl font-bold">
          {formatTime(timeLeft)}
        </span>
      </div>
      <p className="text-xs text-white/70">Time Left</p>
    </div>
  );
};

export default Timer;
