import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { Socket } from "socket.io";
import { connectDB } from "../services/Db";

export const checkForValidUser = async (player_id: string, socket: Socket) => {
  await connectDB();
  // check if the id is valid object id
  if (!mongoose.Types.ObjectId.isValid(player_id)) {
    socket.emit("error:unauthorized");
    return;
  }

  let user;
  try {
    user = await UserModel.findById(player_id);
  } catch (error) {
    console.error("Error finding user", error);
    socket.emit("error:matchmaking");
    return;
  }

  if (!user) {
    socket.emit("error:unauthorized");
    return;
  }
};
