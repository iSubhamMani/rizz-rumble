import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  verified: boolean;
  password: string;
  rank: string | null;
  score: number;
  otp: string | null;
  otpExpiry: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model("User", userSchema);
