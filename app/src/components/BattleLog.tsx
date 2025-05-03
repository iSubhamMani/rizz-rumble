"use client";

import { IPlayer } from "@/app/(main)/battle/[id]/page";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";

interface Round {
  id: number;
  challenge: string;
  winner: string;
  reason: string;
  isNew: boolean;
}

interface BattleLogProps {
  currentPlayer: IPlayer;
  opponentPlayer: IPlayer;
}

const BattleLog = (props: BattleLogProps) => {
  const { challenge, winner, reason, initialChallenge } = useSocket();
  const [rounds, setRounds] = useState<Round[]>([]);
  const { currentPlayer, opponentPlayer } = props;

  useEffect(() => {
    if (challenge && winner && reason) {
      const winnerUsername =
        winner === currentPlayer._id
          ? currentPlayer.username
          : winner === "none"
            ? "None"
            : opponentPlayer.username;
      const newRound = {
        id: Date.now(),
        challenge,
        winner: winnerUsername,
        reason,
        isNew: true,
      };
      setRounds((prev) => [...prev, newRound]);
    }
  }, [challenge, winner, reason, currentPlayer, opponentPlayer]);

  // Mark previous rounds as not new after animation
  useEffect(() => {
    if (rounds.length === 0) return;
    const timeout = setTimeout(() => {
      setRounds((prev) =>
        prev.map((round, idx) =>
          idx === prev.length - 1 ? { ...round, isNew: false } : round
        )
      );
    }, 800); // should match animation duration
    return () => clearTimeout(timeout);
  }, [rounds]);

  return (
    <div
      className="flex-1 border border-violet-300 bg-violet-500/5 text-white 
    p-6 rounded-lg backdrop-blur-lg shadow-md"
    >
      <h1 className="text-xl font-bold">Battle Log</h1>
      <div className="mt-8 text-base font-semibold overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-hide">
        {initialChallenge && (
          <div className="fade-pullup">
            <div className="rounded-md border border-purple-600/40 bg-purple-900/10 p-4 mb-2 shadow-sm backdrop-blur-sm">
              <p className="text-violet-100 font-bold text-sm uppercase tracking-widest glowing-text">
                Challenge:{" "}
                <span
                  style={{
                    textShadow: "0 0 10px #8b5cf6, 0 0 20px #8b5cf6",
                  }}
                  className="font-medium"
                >
                  {initialChallenge}
                </span>
              </p>
            </div>
          </div>
        )}

        {rounds.map((round) => (
          <div key={round.id} className={`${round.isNew ? "fade-pullup" : ""}`}>
            {/* Winner & Reason Card */}
            <div
              className={`rounded-md border border-white/30 bg-black/10 p-4 shadow-inner backdrop-blur-sm ${round.winner === opponentPlayer.username ? "shadow-[0_0_10px_#FF3131,0_0_4px_#FF3131]" : "shadow-[0_0_10px_#8b5cf6,0_0_4px_#8b5cf6]"}`}
            >
              <p className="text-sm">
                <span className="text-purple-300 font-medium">Winner:</span>{" "}
                {round.winner}
              </p>
              <p className="mt-1 text-sm leading-relaxed">
                <span className="text-purple-300 font-medium">Reason:</span>{" "}
                {round.reason}
              </p>
            </div>
            {/* Challenge Card */}
            <div className="mt-6 rounded-md border border-purple-600/40 bg-purple-900/10 p-4 mb-2 shadow-sm backdrop-blur-sm">
              <p className="font-bold text-violet-100 text-sm uppercase tracking-widest glowing-text">
                Challenge:{" "}
                <span
                  style={{
                    textShadow: "0 0 10px #8b5cf6, 0 0 20px #8b5cf6",
                  }}
                  className="font-medium"
                >
                  {round.challenge}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
