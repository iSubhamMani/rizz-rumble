import Image from "next/image";
import React from "react";

const Play = () => {
  return (
    <div className="min-h-screen text-white relative bg-black flex">
      <div className="relative overflow-hidden h-[100vh] cursor-pointer w-full flex items-start">
        <Image
          src={"/pvp.png"}
          width={720}
          height={1280}
          className="w-full h-full object-cover opacity-45 hover:opacity-70 transition-all duration-500 hover:scale-110 ease-in-out"
          alt="PvP"
        />
        <div className="absolute m-8 bottom-0 left-0">
          <h1 className=" text-4xl font-bold drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            PvP
          </h1>
          <p className="font-light">PLay against other players in a 1v1 duel</p>
        </div>
      </div>
      <div className="relative overflow-hidden h-[100vh] cursor-pointer w-full flex items-center justify-center">
        <Image
          src={"/pvai.png"}
          width={720}
          height={1280}
          className="w-full h-full object-cover opacity-45 hover:opacity-65 transition-all duration-500 hover:scale-110 ease-in-out"
          alt="PvAI"
        />
        <div className="absolute m-8 bottom-0 left-0">
          <h1 className=" text-4xl font-bold drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
            PvAI
          </h1>
          <p className="font-light">Play against AI and test your skills</p>
        </div>
      </div>
      <div className="h-[100vh] p-6 w-full">
        <h1 className="text-xl">Leaderboard</h1>
      </div>
    </div>
  );
};

export default Play;
