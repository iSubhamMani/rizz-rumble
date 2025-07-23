"use client";

import { useSocket } from "@/context/SocketContext";
import { Bot, Swords, Users } from "lucide-react";
import MatchmakingDialog from "./MatchmakingDialog";

const GameModes = ({ player }: { player: string }) => {
  const playerInfo = JSON.parse(player);

  const { startMatchmaking, inMatchmaking } = useSocket();

  return (
    <div className="flex flex-col flex-[2] w-full">
      <div className="flex flex-col flex-1 space-y-4">
        <button
          disabled={inMatchmaking}
          onClick={() => startMatchmaking(playerInfo._id)}
          className="p-4 group border w-full border-white/20 transition-all duration-200 ease-in-out hover:border-white shadow-xl rounded-2xl relative overflow-hidden cursor-pointer"
        >
          <h1 className="font-bebas flex items-center font-primary w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            <Users className="mr-2 text-orange-500 size-5" />
            PvP
          </h1>
          <p className="font-rubik w-max font-light text-sm text-white font-secondary">
            Play against other players in a 1v1 duel
          </p>
        </button>
        <button
          disabled={inMatchmaking}
          className="p-4 group border w-full border-white/20 transition-all duration-200 ease-in-out hover:border-white shadow-xl rounded-2xl relative overflow-hidden cursor-pointer"
        >
          <h1 className="font-bebas flex items-center font-primary w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            <Bot className="mr-2 text-purple-500 size-5" />
            PvAI
          </h1>
          <p className="font-rubik w-max font-light text-sm text-white font-secondary">
            Test your skills against AI
          </p>
        </button>
      </div>
      <MatchmakingDialog player={JSON.stringify(playerInfo)} />
    </div>
  );
};

export default GameModes;
