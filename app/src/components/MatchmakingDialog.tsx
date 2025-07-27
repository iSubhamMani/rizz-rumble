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
      <div className="mt-8 fade-pullup">
        <p className="text-base animate-pulse">
          <Swords className="inline mr-2 text-white size-5" />
          Finding a match...
        </p>
        <div className="mt-4 relative w-full h-0.5 overflow-hidden bg-orange-500/10 rounded-full">
          <div className="absolute h-full w-1/3 bg-orange-500 rounded-full animate-scan-move"></div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-white shadow-md font-medium text-black p-3 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => cancelMatchmaking(playerInfo._id)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  );
};

export default MatchmakingDialog;
