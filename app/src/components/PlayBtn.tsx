"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Play } from "lucide-react";
import GameModes from "./GameModes";

const PlayBtn = ({ player }: { player: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2  font-bebas bg-white text-black text-lg sm:text-xl lg:text-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-6 md:py-8 h-auto font-bold rounded-2xl transition-all duration-200 hover:scale-105 shadow-2xl w-full mb-4">
          <Play className="size-6" />
          PLAY NOW
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white/10 rounded-2xl backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Select Mode</DialogTitle>
        </DialogHeader>

        <GameModes player={player} />
      </DialogContent>
    </Dialog>
  );
};

export default PlayBtn;
