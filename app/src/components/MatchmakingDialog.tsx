"use client";

import { useSocket } from "@/context/SocketContext";
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
        style: {
          backgroundColor: "rgba(255, 49, 49, 0.6)",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      });
    }
  }, [matchmakingError]);

  useEffect(() => {
    if (matchmakingTimeout) {
      toast("Couldn't find a match. Try again later.", {
        duration: 5000,
        style: {
          backgroundColor: "rgba(255, 49, 49, 0.6)",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      });
    }
  }, [matchmakingTimeout]);

  return (
    inMatchmaking && (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        }}
        className="fade-pullup flex space-x-6 px-4 py-3 z-50"
      >
        <div className="flex items-center animate-pulse">
          <Swords className="size-5 mr-2" />
          <h2 className="text-base font-bold">Finding a match...</h2>
        </div>
        <button onClick={() => cancelMatchmaking(playerInfo._id)}>
          <X className="size-5" />
        </button>
      </div>
    )
  );
};

export default MatchmakingDialog;
