"use client";

import { useSocket } from "@/context/SocketContext";
import { Bot, Swords, Users } from "lucide-react";
import ButtonPrimary from "./PrimaryButton";

const GameModes = ({ player }: { player: string }) => {
  const playerInfo = JSON.parse(player);

  const { startMatchmaking, cancelMatchmaking, inMatchmaking } = useSocket();

  return (
    <div className="flex flex-col flex-[2] w-full">
      <div className="flex flex-col flex-1 space-y-4">
        <button
          disabled={inMatchmaking}
          onClick={() => startMatchmaking(playerInfo._id)}
          className="p-4 group border w-full border-amber-800 transition-all duration-200 ease-in-out hover:border-amber-900 shadow-xl relative overflow-hidden cursor-pointer"
        >
          <h1 className="flex items-center font-primary w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            <Users className="mr-2 text-yellow-300 size-5" />
            PvP
          </h1>
          <p className="w-max font-light text-sm text-white font-secondary">
            Play against other players in a 1v1 duel
          </p>
          {/* Add a subtle glow effect on hover */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-amber-900/20 transition-all duration-300"></div>
        </button>
        <button
          disabled={inMatchmaking}
          className="p-4 group border w-full border-amber-800 transition-all duration-200 ease-in-out hover:border-amber-900 shadow-xl relative overflow-hidden cursor-pointer"
        >
          <h1 className="flex items-center font-primary w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            <Bot className="mr-2 text-yellow-300 size-5" />
            PvAI
          </h1>
          <p className="w-max font-light text-sm text-white font-secondary">
            Test your skills against AI
          </p>
          {/* Add a subtle glow effect on hover */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-amber-900/20 transition-all duration-300"></div>
        </button>
      </div>
      {inMatchmaking && (
        <div className="mt-8 fade-pullup">
          <p className="text-base font-secondary font-bold animate-pulse">
            <Swords className="inline mr-2 text-yellow-300 size-5" />
            Finding a match...
          </p>
          <div className="mt-4 relative w-full h-0.5 overflow-hidden bg-amber-500/10 rounded-full">
            <div className="absolute h-full w-1/3 bg-amber-500 rounded-full animate-scan-move"></div>
          </div>
          <div className="flex justify-end mt-6">
            <ButtonPrimary onClick={() => cancelMatchmaking(playerInfo._id)}>
              Cancel
            </ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameModes;
