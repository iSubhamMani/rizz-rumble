"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  MessageCircle,
  Send,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";
import BattleLog from "@/components/BattleLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Timer from "@/components/Timer";
import confetti from "canvas-confetti";
import ChatContainer from "@/components/ChatContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
interface IMatchInfo {
  matchId: string;
  players: {
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

export interface IPlayer {
  _id: string;
  username: string;
  rank: number;
}

function showConfetti() {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ["#8b5cf6", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
}

const Battle = () => {
  const { id: matchId } = useParams();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [matchInfo, setMatchInfo] = useState<IMatchInfo | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<IPlayer | null>(null);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"chat" | "log">("chat");
  const [prompt, setPrompt] = useState<string | null>(null);

  const router = useRouter();
  const {
    initialChallenge,
    submittedPrompt,
    isMatchEnd,
    winner,
    roundNumber,
    isPromptSubmitted,
    setIsPromptSubmitted,
    setChatMessages,
  } = useSocket();

  const getCurrentPlayer = useCallback(() => {
    if (!session || !session.user) return null;
    const player = matchInfo?.players.find(
      (player) => player._id === session.user?._id
    );
    return player ? player : null;
  }, [session, matchInfo]);

  const getOpponentPlayer = useCallback(() => {
    if (!session || !session.user) return null;
    const player = matchInfo?.players.find(
      (player) => player._id !== session.user?._id
    );
    return player ? player : null;
  }, [session, matchInfo]);

  useEffect(() => {
    if (!matchInfo) return;
    const currentPlayer = getCurrentPlayer();
    const opponentPlayer = getOpponentPlayer();
    setCurrentPlayer(currentPlayer);
    setOpponentPlayer(opponentPlayer);
  }, [matchInfo, getCurrentPlayer, getOpponentPlayer]);

  // show confetti
  useEffect(() => {
    if (matchInfo && isMatchEnd && winner === currentPlayer?._id) {
      showConfetti();
    }
  }, [matchInfo, isMatchEnd, winner, currentPlayer]);

  useEffect(() => {
    if (!matchId) return;

    async function getMatchInfo() {
      setLoadingInfo(true);
      try {
        const res = await axios.get(`/api/match/${matchId}`);
        setMatchInfo(res.data);
      } catch (error) {
        setMatchInfo(null);
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
        <div className="w-full h-full flex justify-center items-center gap-4 animate-pulse">
          <Swords className="text-white size-7" />
          <p className="text-white text-lg font-bold">Loading Match...</p>
        </div>
      </div>
    );
  }

  if (!loadingInfo && !matchInfo) {
    return (
      <div className="flex flex-col h-screen text-white relative overflow-hidden">
        <div className="w-full h-full flex justify-center items-center gap-4">
          <Swords className="text-white size-7" />
          <p className="text-white text-lg font-bold">
            Oops! Looks like that match rage quit life.
          </p>
        </div>
      </div>
    );
  }

  return (
    currentPlayer &&
    opponentPlayer && (
      <>
        {/* Main Battle Interface */}
        {isMatchEnd && (
          <>
            <AlertDialog open={isMatchEnd}>
              <AlertDialogContent className="bg-white/10 backdrop-blur-sm border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-bold text-xl text-center text-orange-400">
                    {winner === currentPlayer._id
                      ? "You've won the match!"
                      : winner === "none"
                        ? "It's a draw!"
                        : "Better Luck Next Time!"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-medium text-sm text-white">
                    {winner === currentPlayer._id
                      ? "Congratulations! You have emerged victorious in this battle of rizz. Your creativity and charm have won the day, and your opponent has been left in awe of your skills."
                      : winner === "none"
                        ? `
                      The match has ended in a draw! Both players have shown exceptional skill and creativity, making it a truly memorable battle.
                    `
                        : "The match has come to an end, and while you may not have emerged as the victor this time, your efforts and creativity were commendable. Every battle is a learning experience, and we hope to see you back in action soon!"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => router.replace("/play")}
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    Return Home
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {/* Battle Header */}
        <div className="mb-4 md:mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Players */}
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-green-400">
                      <AvatarImage src="/placeholder.svg?height=56&width=56" />
                      <AvatarFallback className="bg-green-600 text-white text-lg">
                        P1
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="font-semibold text-sm md:text-base">
                        {currentPlayer.username}
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-300 text-xs"
                      >
                        Level {currentPlayer.rank}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-white text-xl md:text-2xl font-bold px-2">
                    VS
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-red-400">
                      <AvatarImage src="/placeholder.svg?height=56&width=56" />
                      <AvatarFallback className="bg-red-600 text-white text-lg">
                        OP
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="font-semibold text-sm md:text-base">
                        {opponentPlayer.username}
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-red-500/20 text-red-300 text-xs"
                      >
                        Level {opponentPlayer.rank}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Battle Stats */}
                <div className="flex items-center space-x-4 md:space-x-8 text-white">
                  <Timer />
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-lg md:text-xl font-bold">
                        15 - 12
                      </span>
                    </div>
                    <p className="text-xs text-white/70">Score</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span className="text-lg md:text-xl font-bold">
                        Round {roundNumber}
                      </span>
                    </div>
                    <p className="text-xs text-white/70">Current</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden mb-4">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 ${activeTab === "chat" ? "bg-orange-500 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant={activeTab === "log" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("log")}
              className={`flex-1 ${activeTab === "log" ? "bg-orange-500 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Battle Log
            </Button>
          </div>
        </div>

        {/* Chat & Battle Log Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[calc(100vh-200px)] md:h-[calc(100vh-220px)]">
          {/* Chat Panel */}
          <Card
            className={`bg-white/10 backdrop-blur-sm border-white/20 ${activeTab !== "chat" ? "hidden md:flex" : "flex"} flex-col h-full`}
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-green-400" />
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <ChatContainer currentPlayer={currentPlayer!} />
              {initialChallenge && (
                <>
                  <Separator className="bg-white/20" />
                  <div className="p-4 flex-shrink-0">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={prompt || ""}
                        disabled={isPromptSubmitted}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && prompt) {
                            setPrompt("");
                            setIsPromptSubmitted(true);
                            const p = prompt
                              ? prompt.trim().length === 0
                                ? "EMPTY RESPONSE"
                                : prompt
                              : "EMPTY RESPONSE";
                            submittedPrompt.current = p;
                            setChatMessages((prev) => [
                              ...prev,
                              { message: p, sender: currentPlayer._id },
                            ]);
                          }
                        }}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400"
                      />
                      <Button
                        onClick={() => {
                          setPrompt("");
                          setIsPromptSubmitted(true);
                          const p = prompt
                            ? prompt.trim().length === 0
                              ? "EMPTY RESPONSE"
                              : prompt
                            : "EMPTY RESPONSE";
                          submittedPrompt.current = p;
                          setChatMessages((prev) => [
                            ...prev,
                            { message: p, sender: currentPlayer._id },
                          ]);
                        }}
                        className="max-w-12"
                      >
                        <Send />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Battle Log Panel */}
          <BattleLog
            currentPlayer={currentPlayer!}
            opponentPlayer={opponentPlayer!}
            activeTab={activeTab}
          />
        </div>
      </>
    )
  );
};

export default Battle;
