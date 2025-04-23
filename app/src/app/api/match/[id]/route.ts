import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/config";
import { MatchModel } from "@/models/Match";

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

    const matchInfo = await MatchModel.aggregate([
      {
        $match: {
          matchId: matchId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                rank: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          matchId: 1,
          users: 1,
          rounds: 1,
          currentRound: 1,
          status: 1,
          overallWinner: 1,
        },
      },
    ]);

    if (!matchInfo || matchInfo.length === 0) {
      throw new Error("Match not found");
    }
    const match = matchInfo[0];

    return NextResponse.json(match);
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
