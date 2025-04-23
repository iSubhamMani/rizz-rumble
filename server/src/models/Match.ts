import mongoose, { ObjectId, Schema } from "mongoose";
import { IUser } from "./User";

interface IPrompt {
  userId: ObjectId;
  prompt: string;
}

interface IRound {
  roundNumber: number;
  prompts: IPrompt[];
  winner: ObjectId;
}

export enum MatchStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

interface IMatch {
  matchId: string;
  users: ObjectId[];
  rounds: IRound[];
  currentRound: number;
  status: MatchStatus;
  overallWinner: ObjectId;
}

const matchSchema = new Schema<IMatch>(
  {
    matchId: {
      type: String,
      required: true,
      unique: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    rounds: [
      {
        roundNumber: {
          type: Number,
          required: true,
        },
        prompts: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            prompt: {
              type: String,
              required: true,
            },
          },
        ],
        winner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    currentRound: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.WAITING,
    },
    overallWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const MatchModel =
  mongoose.models.Match || mongoose.model("Match", matchSchema);
