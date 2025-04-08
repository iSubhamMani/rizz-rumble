"use server";
import { EmailTemplate } from "@/components/otp-email-template";
import { UserModel } from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp(email: string) {
  try {
    if (!email.trim()) throw new Error("Email is required");
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation
    if (!isEmailValid) throw new Error("Invalid email format");

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await UserModel.findOneAndUpdate({ email }, { otp, otpExpiry });

    const { error } = await resend.emails.send({
      from: "Subham from Prompt Brawl <no-reply@updates.subhammani.xyz>",
      to: email,
      subject: "Verify Your Email - Prompt Brawl",
      react: await EmailTemplate({ otp: otp.toString() }),
    });

    if (error) {
      throw new Error("Error sending OTP");
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error Sending OTP"
    );
  }
}
