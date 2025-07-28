"use client";

import { IPlayer } from "@/app/(main)/battle/[id]/page";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity } from "lucide-react";

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
  activeTab: string;
}

const BattleLog = (props: BattleLogProps) => {
  const { challenge, winner, reason, initialChallenge, judging } = useSocket();
  const [rounds, setRounds] = useState<Round[]>([]);
  const { currentPlayer, opponentPlayer, activeTab } = props;
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
    }, 800);
    return () => clearTimeout(timeout);
  }, [rounds]);

  useEffect(() => {
    if (bottomRef.current && rounds.length > 0) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [rounds]);

  return (
    <Card
      className={`bg-white/10 backdrop-blur-sm border-white/20 ${activeTab !== "log" ? "hidden md:flex" : "flex"} flex-col h-full`}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-purple-400" />
          Battle Log
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 min-h-0">
        <div className="space-y-2 pb-4">
          {initialChallenge && (
            <div className="fade-pullup">
              <div className="rounded-md border border-white/20 bg-white/10 p-4 mb-2 shadow-sm backdrop-blur-sm">
                <p className="text-orange-300 font-bold text-sm uppercase tracking-widest">
                  Challenge:{" "}
                  <span className="font-medium text-white">
                    {initialChallenge}
                  </span>
                </p>
              </div>
            </div>
          )}

          {rounds.map((round) => (
            <div
              key={round.id}
              className={`${round.isNew ? "fade-pullup" : ""}`}
            >
              {/* Winner & Reason Card */}
              <div
                className={`rounded-md border border-white/20 bg-white/10 p-4 shadow-inner backdrop-blur-sm`}
              >
                <p className="text-sm text-white">
                  <span className="text-orange-300 font-medium">Winner:</span>{" "}
                  {round.winner}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white">
                  <span className="text-purple-300 font-medium">Reason:</span>{" "}
                  {round.reason}
                </p>
              </div>
              {/* Challenge Card */}
              <div
                ref={bottomRef}
                className="mt-6 rounded-md border border-white/20 bg-white/10 p-4 mb-2 shadow-sm backdrop-blur-sm"
              >
                <p className="font-bold text-orange-300 text-sm uppercase tracking-widest">
                  Challenge:{" "}
                  <span className="font-medium text-white">
                    {round.challenge}
                  </span>
                </p>
              </div>
            </div>
          ))}
          {judging && (
            <p className="text-white font-medium animate-pulse text-center">
              Judging round...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BattleLog;
