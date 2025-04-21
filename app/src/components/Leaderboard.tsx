import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import ButtonPrimary from "./ButtonPrimary";
import { Trophy } from "lucide-react";

const Leaderboard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="z-50 cursor-pointer flex items-start gap-4">
          <ButtonPrimary className="flex items-center">
            Leaderboard
            <Trophy className="size-6" />
          </ButtonPrimary>
        </div>
      </DialogTrigger>

      <DialogContent
        className="border border-violet-300 bg-black/40 text-white 
          p-6 rounded-lg backdrop-blur-lg shadow-md"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Leaderboard</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
