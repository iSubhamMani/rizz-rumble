import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/config";
import { redis } from "@/lib/redisClient";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const matchId = url.pathname.split("/").pop();

    if (!matchId) {
      throw new Error("Match ID is required");
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const matchDetails = await redis.Store.get(matchId);

    if (!matchDetails) {
      throw new Error("Match not found");
    }

    const parsedMatchDetails = JSON.parse(matchDetails);
    const { players } = parsedMatchDetails;
    const player1 = players[0];
    const player2 = players[1];
    const player1Details = await UserModel.findById(player1.player_id);
    const player2Details = await UserModel.findById(player2.player_id);

    if (!player1Details || !player2Details) {
      throw new Error("Player not found");
    }

    const playerDetails = {
      matchId: matchId,
      players: [
        {
          _id: player1Details._id,
          username: player1Details?.username,
          rank: player1Details?.rank,
        },
        {
          _id: player2Details._id,
          username: player2Details?.username,
          rank: player2Details?.rank,
        },
      ],
    };

    return NextResponse.json(playerDetails);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
