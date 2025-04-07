"use server";

import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function verifyEmail(email: string, otp: string) {
  await connectDB();

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("Error Verifying - No User Found");
    }

    const otpFromDB = user.otp;
    const otpExpiry = user.otpExpiry;

    if (new Date(otpExpiry).getTime() < Date.now())
      throw new Error("OTP has expired. Request a new one.");

    if (otpFromDB !== otp) throw new Error("Invalid OTP");

    await UserModel.updateOne(
      { email },
      {
        verified: true,
        otp: null,
        otpExpiry: null,
      }
    );

    return { success: true, message: "Email Verified Successfully" };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error Verifying Email"
    );
  }
}
