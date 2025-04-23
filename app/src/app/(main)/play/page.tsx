import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";
import TopPlayerInfo from "@/components/TopPlayerInfo";
import PlayBtn from "@/components/PlayBtn";
import Leaderboard from "@/components/Leaderboard";
import MatchmakingDialog from "@/components/MatchmakingDialog";

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
    <main className="flex flex-col h-screen text-white relative overflow-hidden">
      {/* Background with a dark base and radial gradient for light convergence */}
      <PlayBtn player={JSON.stringify(user)} />
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
      <div className="flex gap-6 items-start justify-between px-8 pt-6">
        <TopPlayerInfo props={JSON.stringify(user)} />
        <MatchmakingDialog player={JSON.stringify(user)} />
        <Leaderboard />
      </div>
    </main>
  );
};

export default Play;
