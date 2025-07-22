import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";
import ProfileInfo from "@/components/ProfileInfo";
import PlayBtn from "@/components/PlayBtn";
import Leaderboard from "@/components/Leaderboard";
import MatchmakingDialog from "@/components/MatchmakingDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Calendar,
  Settings,
  Target,
  Trophy,
  User,
  Users,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PlayPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return (
      <div className="flex flex-col h-screen text-white relative overflow-hidden">
        <div
          className="absolute inset-0 -z-50"
          style={{
            background: `
              radial-gradient(
                circle at 120% 50%, 
                rgba(167, 139, 250, 0.9) 20%, 
                rgba(84, 67, 135, 0.9) 30%, 
                rgba(0, 0, 0, 1.0) 80%, 
                #000000 80%
              )
            `,
          }}
        />
        <div className="flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold">Please log in to play</h1>
        </div>
      </div>
    );
  }

  const userId = session.user._id;
  await connectDB();
  const user = await UserModel.findById(userId);

  return (
    <main>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-bebas text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
          Rizz Rumble
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Quick Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white/30">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">
                    PB
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Player One</h3>
                  <Badge
                    variant="secondary"
                    className="bg-orange-500/20 text-orange-300 border-orange-500/30"
                  >
                    Level 15
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs sm:text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-white/70">Wins</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Win Rate</span>
                <span className="font-semibold">73%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Rank</span>
                <span className="font-semibold text-yellow-400">#12</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Main Actions */}
        <div className="space-y-6">
          {/* Play Button */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <button className="flex items-center justify-center gap-2  font-bebas bg-white text-black text-lg sm:text-xl lg:text-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-6 md:py-8 h-auto font-bold rounded-2xl transition-all duration-200 hover:scale-105 shadow-2xl w-full mb-4">
                <Play className="size-6" />
                PLAY NOW
              </button>
              <p className="text-white/70 text-sm">
                Show off your rizz in a duel!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Leaderboard & Recent Activity */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-4 text-sm sm:text-base">
              <CardTitle className="flex items-center gap-2 border-b border-white/20 pb-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { rank: 1, name: "BattleMaster", score: "2,847", badge: "🥇" },
                { rank: 2, name: "QuickDraw", score: "2,691", badge: "🥈" },
                { rank: 3, name: "ShotCaller", score: "2,534", badge: "🥉" },
                { rank: 4, name: "FastBreak", score: "2,401", badge: "" },
                { rank: 5, name: "CourtKing", score: "2,298", badge: "" },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs sm:text-sm md:text-base">
                      {player.badge || `#${player.rank}`}
                    </span>
                    <span className="font-medium text-xs sm:text-sm md:text-base">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
                    {player.score}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2" // Center the sphere horizontally
        style={{
          width: "min(100vw, 800px)", // Max width to ensure it doesn't get too big on ultra-wide screens
          height: "min(100vw, 800px)", // Make height equal to width for a perfect circle
          bottom: "-min(100vw, 800px) / 2", // Adjust this to control how much of the sphere is visible (e.g., half its height)
          // You might need to fine-tune the bottom value based on how much of the glow you want showing.
          // For example, if you want only the top 20% of the sphere visible, bottom: '-80%'
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-70"
            style={{ backgroundColor: "#34495e", filter: "blur(400px)" }} // Increased blur for a stronger glow
          ></div>
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60"
            style={{ backgroundColor: "#2c3e50", filter: "blur(150px)" }} // Even more blur for depth
          ></div>
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-70"
            style={{ backgroundColor: "#4a6d7c", filter: "blur(400px)" }} // Widest blur for the outer glow
          ></div>
          {/* Inner, brighter glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-60"
            style={{ backgroundColor: "#2d403c", filter: "blur(100px)" }}
          ></div>
        </div>
      </div>
    </main>
  );
};

export default PlayPage;
