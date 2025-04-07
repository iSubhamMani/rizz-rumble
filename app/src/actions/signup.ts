"use server";

import { EmailTemplate } from "@/components/otp-email-template";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signup(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;

  if (!username.trim() || !password.trim() || !email.trim())
    throw new Error("Username, password and email are required");

  await connectDB();

  try {
    const existingUsername = await UserModel.findOne({
      username,
      verified: true,
    });

    if (existingUsername) throw new Error("Username already taken");

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) throw new Error("User with this email already exists");

    const isUsernameValid = /^[a-zA-Z0-9_]+$/.test(username); // Regex to allow only alphanumeric characters and underscores
    if (!isUsernameValid) throw new Error("Invalid username");
    const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
      password
    ); // At least 8 characters, at least one letter and one number
    if (!isPasswordValid)
      throw new Error(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
    // Check if the username is already taken

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      email,
      otp,
      otpExpiry: new Date(Date.now() + 30 * 60 * 1000), // OTP valid for 30 minutes
    });
    if (!newUser) throw new Error("Error creating user");
    // send otp to email

    const { error } = await resend.emails.send({
      from: "Subham from Prompt Brawl <no-reply@updates.subhammani.xyz>",
      to: email,
      subject: "OTP For Email Verification - Prompt Brawl",
      react: await EmailTemplate({ name: username, otp: otp.toString() }),
    });

    if (error) {
      throw new Error("Error sending OTP");
    }

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred. Please Try again"
    );
  }
}
