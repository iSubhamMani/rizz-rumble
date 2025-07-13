"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Swords } from "lucide-react";
import GameModes from "./GameModes";
import StyledButtonPrimary from "./StyledButtonPrimary";

const PlayBtn = ({ player }: { player: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <StyledButtonPrimary className="mt-6">
          <div className="relative flex items-center justify-center gap-3">
            <Swords className="size-4 sm:size-5 md:size-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="drop-shadow-lg">Play</span>
            <Swords className="size-4 sm:size-5 md:size-6 group-hover:-rotate-12 transition-transform duration-300" />
          </div>
        </StyledButtonPrimary>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-amber-900/20 backdrop-blur-md border-amber-900 border-4 rounded-lg">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600" />
        <DialogHeader>
          <DialogTitle className="text-base font-bold font-secondary">
            Select Mode
          </DialogTitle>
        </DialogHeader>

        <GameModes player={player} />
      </DialogContent>
    </Dialog>
  );
};

export default PlayBtn;
