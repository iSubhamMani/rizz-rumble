"use client";

import ButtonPrimary from "@/components/ButtonPrimary";
import ChatMessage from "@/components/ChatMessage";
import OpponentChatMessage from "@/components/OpponentChatMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Send, Swords } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface IMatchInfo {
  matchId: string;
  users: {
    _id: string;
    username: string;
    rank: number;
  }[];
  rounds: {
    roundNumber: number;
    prompts: {
      userId: string;
      prompt: string;
    }[];
    winner: string | null;
  }[];
  currentRound: number;
  status: string;
  overallWinner: string | null;
}

interface IPlayer {
  _id: string;
  username: string;
  rank: number;
}

const Battle = () => {
  const { id: matchId } = useParams();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [matchInfo, setMatchInfo] = useState<IMatchInfo | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<IPlayer | null>(null);
  const { data: session } = useSession();

  const getCurrentPlayer = useCallback(() => {
    if (!session || !session.user) return null;
    const user = matchInfo?.users.find(
      (user) => user._id === session.user?._id
    );
    return user ? user : null;
  }, [session, matchInfo]);

  const getOpponentPlayer = useCallback(() => {
    if (!session || !session.user) return null;
    const user = matchInfo?.users.find(
      (user) => user._id !== session.user?._id
    );
    return user ? user : null;
  }, [session, matchInfo]);

  useEffect(() => {
    if (!matchInfo) return;
    const currentPlayer = getCurrentPlayer();
    const opponentPlayer = getOpponentPlayer();
    setCurrentPlayer(currentPlayer);
    setOpponentPlayer(opponentPlayer);
  }, [matchInfo, getCurrentPlayer, getOpponentPlayer]);

  useEffect(() => {
    if (!matchId) return;

    async function getMatchInfo() {
      setLoadingInfo(true);
      try {
        const res = await axios.get(`/api/match/${matchId}`);
        setMatchInfo(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingInfo(false);
      }
    }

    getMatchInfo();
  }, [matchId]);

  if (loadingInfo || !session) {
    return (
      <div className="flex flex-col h-screen text-white relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl" />

        <div
          className="absolute inset-0 -z-50"
          style={{
            background: `
             radial-gradient(
        circle at 120% 50%,
        rgba(0, 0, 0, 0.9) 10%,         
        rgba(0, 0, 0, 0.9) 10%,         /* subtle transition */
        rgba(5, 0, 20, 0.95) 60%,        /* near-black with purple hint */
        rgba(0, 0, 0, 1.0) 85%            /* pure black edge */
      )
            `,
          }}
        />

        <div className="w-full h-full flex justify-center items-center gap-4  animate-pulse">
          <Swords className="text-white size-7" />
          <p className="text-white text-lg font-bold">Loading Match...</p>
        </div>
      </div>
    );
  }

  return (
    currentPlayer &&
    opponentPlayer && (
      <div className="flex flex-col h-screen text-white relative overflow-hidden">
        {/* Background with a dark base and radial gradient for light convergence */}
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl" />

        <div
          className="absolute inset-0 -z-50"
          style={{
            background: `
             radial-gradient(
        circle at 120% 50%,
        rgba(0, 0, 0, 0.9) 10%,         
        rgba(0, 0, 0, 0.9) 10%,         /* subtle transition */
        rgba(5, 0, 20, 0.95) 60%,        /* near-black with purple hint */
        rgba(0, 0, 0, 1.0) 85%            /* pure black edge */
      )
            `,
          }}
        />

        {/* Content */}
        <main className="flex gap-6 px-8 py-6 h-screen">
          <div className="flex-[2] h-full flex flex-col">
            <div className="flex items-center gap-8">
              <div className="flex gap-4">
                <Avatar className="text-black cursor-pointer">
                  <AvatarImage src={"/default_avatar.jpg"} />
                  <AvatarFallback>TN</AvatarFallback>
                </Avatar>
                <div className="text-start">
                  <p className="text-base font-bold tracking-widest">
                    <span className="inline size-4"></span>
                    {opponentPlayer.username}
                  </p>
                  <p className="text-xs font-light">
                    Rank {opponentPlayer.rank}
                  </p>
                </div>
              </div>
              <Swords className="text-white size-7" />
              <div className="flex gap-4">
                <div className="text-end">
                  <p className="text-base font-bold tracking-widest">
                    <span className="inline size-4"></span>
                    You
                  </p>
                  <p className="text-xs font-light">
                    Rank {currentPlayer.rank}
                  </p>
                </div>
                <Avatar className="text-black cursor-pointer">
                  <AvatarImage src={"/default_avatar.jpg"} />
                  <AvatarFallback>TN</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex-1 max-w-4xl px-4 mt-6 flex flex-col overflow-hidden">
              {/* Scrollable messages */}
              <div className="py-4 px-2 flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                <ChatMessage />
                <OpponentChatMessage />
                <ChatMessage />
                <OpponentChatMessage />
                <ChatMessage />
                <OpponentChatMessage />
                <ChatMessage />
                <OpponentChatMessage />
                <ChatMessage />
                <OpponentChatMessage />
                <ChatMessage />
                {/* Add more messages to test scroll */}
              </div>
              <div className="flex items-start overflow-hidden gap-4">
                <Textarea
                  className="border border-violet-300 bg-black/40 text-white rounded-lg shadow-md h-24 resize-none
              focus-visible:ring-0 focus-visible:outline-none scrollbar-hide"
                  placeholder="Type your prompt here..."
                />
                <ButtonPrimary className="max-w-12">
                  <Send />
                </ButtonPrimary>
              </div>
            </div>
          </div>
          <div
            className="flex-1 border border-violet-300 bg-black/40 text-white 
            p-6 rounded-lg backdrop-blur-lg shadow-md"
          >
            <h1 className="text-xl font-bold">Battle Log</h1>
          </div>
        </main>
      </div>
    )
  );
};

export default Battle;
