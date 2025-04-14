import Leaderboard from "@/components/Leaderboard";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";
import EditProfileDialog from "@/components/EditProfileDialog";
import { Particles } from "@/components/magicui/particles";
import GameModes from "@/components/GameModes";

const Play = async () => {
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
    <div className="flex flex-col h-screen text-white relative overflow-hidden">
      {/* Background with a dark base and radial gradient for light convergence */}
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

      {/* Particle effect */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={30}
        ease={80}
        color={"#a78bfa"}
        refresh
      />

      {/* Content */}
      <div className="flex justify-end pr-8 pt-4">
        <EditProfileDialog props={JSON.stringify(user)} />
      </div>
      <main className="flex flex-1">
        <div className="flex-[2] w-full flex flex-col lg:flex-row gap-6 p-8">
          <GameModes player={JSON.stringify(user)} />
        </div>
        <Leaderboard />
      </main>
      <footer className="px-8 py-4">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} Prompt Brawl. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Play;
