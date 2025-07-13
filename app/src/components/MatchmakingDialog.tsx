"use client";

import { useSocket } from "@/context/SocketContext";
import { toastStyle } from "@/lib/toastStyle";
import { Swords, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const MatchmakingDialog = ({ player }: { player: string }) => {
  const playerInfo = JSON.parse(player);
  const {
    cancelMatchmaking,
    inMatchmaking,
    matchId,
    matchFound,
    matchmakingError,
    matchmakingTimeout,
  } = useSocket();

  const router = useRouter();

  useEffect(() => {
    if (matchFound && matchId) {
      router.push(`/battle/${matchId}`);
    }
  }, [matchFound, matchId, router]);

  useEffect(() => {
    if (matchmakingError) {
      toast(matchmakingError, {
        duration: 5000,
        style: { ...toastStyle, textTransform: "capitalize" },
      });
    }
  }, [matchmakingError]);

  useEffect(() => {
    if (matchmakingTimeout) {
      toast("Couldn't find a match. Try again later.", {
        duration: 5000,
        style: { ...toastStyle, textTransform: "capitalize" },
      });
    }
  }, [matchmakingTimeout]);

  return (
    inMatchmaking && (
      <div
        className={`
          h-full
          group relative px-6 py-4 
          bg-transparent/40
          border-4 border-amber-900 
          rounded-none
          font-secondary text-sm sm:text-lg md:text-xl text-amber-100
          shadow-lg
          flex items-center justify-between
        `}
      >
        {/* Wood grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-800/20 to-amber-900/40 rounded-none pointer-events-none" />
        {/* Metal corner brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600 pointer-events-none" />
        <div className="flex items-center animate-pulse z-10">
          <Swords className="size-5 mr-2" />
          <h2 className="font-bold">Finding a match...</h2>
        </div>
        <button
          onClick={() => cancelMatchmaking(playerInfo._id)}
          className="z-10 ml-4 hover:text-amber-300 transition-colors"
          aria-label="Cancel matchmaking"
        >
          <X className="size-5" />
        </button>
      </div>
    )
  );
};

export default MatchmakingDialog;
