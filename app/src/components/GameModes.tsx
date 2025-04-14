"use client";

import { useSocket } from "@/context/SocketContext";
import Image from "next/image";

const GameModes = ({ player }: { player: string }) => {
  const playerInfo = JSON.parse(player);

  const { startMatchmaking } = useSocket();

  return (
    <>
      <div
        onClick={() => startMatchmaking(playerInfo._id)}
        className="border border-violet-900/60 transition-all duration-200 ease-in-out hover:border-violet-900/80 shadow-xl max-w-[560px] max-h-[280px] relative overflow-hidden cursor-pointer flex items-start group"
      >
        {/* Border animation effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 border-2 border-violet-600 animate-pulse"></div>
          <div className="absolute inset-0 border border-violet-500/20"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/0 via-violet-600/30 to-violet-600/0 blur-sm group-hover:animate-border-flow"></div>
        </div>

        {/* Image placeholder */}
        <div className="w-full h-full bg-gray-800 opacity-80 group-hover:opacity-85 transition-all duration-500 group-hover:scale-110 ease-in-out flex items-center justify-center">
          <Image
            src="/pvp.png"
            alt="PvP"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text overlay */}
        <div className="absolute m-6 bottom-0 left-0 z-10">
          <h1 className="w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            PvP
          </h1>
          <p className="w-max font-light text-sm text-white">
            Play against other players in a 1v1 duel
          </p>
        </div>

        {/* Add a subtle glow effect on hover */}
        <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/10 transition-all duration-300"></div>
      </div>
      <div className="border border-violet-900/60 transition-all duration-200 ease-in-out hover:border-violet-900/80 shadow-xl max-w-[560px] max-h-[280px] relative overflow-hidden cursor-pointer flex items-start group">
        {/* Border animation effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 border-2 border-violet-600 animate-pulse"></div>
          <div className="absolute inset-0 border border-violet-500/20"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/0 via-violet-600/30 to-violet-600/0 blur-sm group-hover:animate-border-flow"></div>
        </div>

        {/* Image placeholder */}
        <div className="w-full h-full bg-gray-800 opacity-80 group-hover:opacity-85 transition-all duration-500 group-hover:scale-110 ease-in-out flex items-center justify-center">
          <Image
            src="/pvai.png"
            alt="PvP"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text overlay */}
        <div className="absolute m-6 bottom-0 left-0 z-10">
          <h1 className="w-max text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            PvAI
          </h1>
          <p className="w-max font-light text-sm text-white">
            Play against AI to test your skills
          </p>
        </div>

        {/* Add a subtle glow effect on hover */}
        <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/10 transition-all duration-300"></div>
      </div>
    </>
  );
};

export default GameModes;
