"use client";
import React from "react";
import Orb from "./Orb/Orb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Swords } from "lucide-react";
import GameModes from "./GameModes";

const PlayBtn = ({ player }: { player: string }) => {
  return (
    <Orb
      hoverIntensity={0.0}
      rotateOnHover={true}
      hue={317}
      forceHoverState={false}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="shadow-3xl flex items-center animate-pulse duration-800 text-violet-300 uppercase rounded-full p-20 sm:p-40 text-lg sm:text-xl md:text-2xl font-bold
        "
            >
              Play
              <Swords className="size-6 ml-2" />
            </button>
          </div>
        </DialogTrigger>

        <DialogContent
          className="border border-violet-300 bg-black/40 text-white 
                    p-6 rounded-lg backdrop-blur-lg shadow-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Select Mode
            </DialogTitle>
          </DialogHeader>

          <GameModes player={player} />
        </DialogContent>
      </Dialog>
    </Orb>
  );
};

export default PlayBtn;
