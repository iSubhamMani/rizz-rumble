import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";
import ProfileInfo from "@/components/ProfileInfo";
import PlayBtn from "@/components/PlayBtn";
import Leaderboard from "@/components/Leaderboard";
import MatchmakingDialog from "@/components/MatchmakingDialog";
import { Swords } from "lucide-react";
import { Particles } from "@/components/magicui/particles";

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
    <main className="h-screen relative overflow-hidden">
      {/* Gradient overlay for better text readability */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={20}
        ease={80}
        color={"#f59e0b"}
        refresh
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Main content */}
      <div className="relative z-10 h-screen flex gap-4 p-4 sm:p-6 text-center">
        {/* Player Profile */}

        <ProfileInfo props={JSON.stringify(user)} />

        {/* Battle */}
        <div className="flex-1">
          <h2 className="font-tertiary uppercase text-amber-400 text-2xl md:text-3xl mb-4 tracking-widest opacity-90">
            PROMPT
            <span>
              <Swords className="inline -mt-1 mx-2" />
            </span>
            BRAWL
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          <h1 className="mt-8 font-secondary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready for the showdown?
          </h1>
          <p className="font-tertiary text-yellow-300 text-lg">
            Draw your prompts warrior!
          </p>
          <PlayBtn player={JSON.stringify(user)} />
        </div>
        <MatchmakingDialog player={JSON.stringify(user)} />
        {/* Leaderboard */}
        <Leaderboard />
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

export default Play;
