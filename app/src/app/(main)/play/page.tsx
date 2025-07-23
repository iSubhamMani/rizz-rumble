import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";
import ProfileInfo from "@/components/ProfileInfo";
import PlayBtn from "@/components/PlayBtn";
import Leaderboard from "@/components/Leaderboard";
import { Card, CardContent } from "@/components/ui/card";

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
        <ProfileInfo props={JSON.stringify(user)} />

        {/* Center Column - Main Actions */}
        <div className="space-y-6">
          {/* Play Button */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <PlayBtn player={JSON.stringify(user)} />
              <p className="text-white/70 text-sm">
                Show off your rizz in a duel!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Leaderboard & Recent Activity */}
        <Leaderboard />
      </div>
    </main>
  );
};

export default PlayPage;
