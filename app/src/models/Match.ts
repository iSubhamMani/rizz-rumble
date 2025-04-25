import mongoose, { ObjectId, Schema } from "mongoose";

export enum MatchStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

interface IMatch {
  matchId: string;
  users: ObjectId[];
  status: MatchStatus;
  winner: ObjectId;
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
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.IN_PROGRESS,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const MatchModel =
  mongoose.models.Match || mongoose.model("Match", matchSchema);
