"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Swords } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { signup } from "@/actions/signup";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { signIn } from "next-auth/react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { DialogDescription } from "@radix-ui/react-dialog";
import { verifyEmail } from "@/actions/email/verify";
import { sendOtp } from "@/actions/email/send";
import { useRouter } from "next/navigation";
import StyledButtonPrimary from "./StyledButtonPrimary";
import PrimaryButton from "./PrimaryButton";

const JoinButton = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<"login" | "signup" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const verifyCredentials = (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isEmailValid) throw new Error("Invalid email address");

      if (!username.trim() || !password.trim())
        throw new Error("Username and password are required");
      const isUsernameValid = /^[a-zA-Z0-9_]+$/.test(username); // Regex to allow only alphanumeric characters and underscores
      if (!isUsernameValid)
        throw new Error(
          "Only alphanumeric characters and underscores are allowed in username"
        );
      const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
        password
      ); // At least 8 characters, at least one letter and one number
      if (!isPasswordValid)
        throw new Error(
          "Password must be at least 8 characters long and contain at least one letter and one number"
        );
      return true;
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Error validating credentials",
        {
          duration: 5000,
          style: {
            backgroundColor: "#EE4B2B",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        }
      );
      return false;
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      const verifiedCredentials = verifyCredentials(username, password, email);
      if (!verifiedCredentials) return;

      const fd = new FormData();
      fd.append("username", username.toUpperCase());
      fd.append("password", password);
      fd.append("email", email);

      const res = await signup(fd);

      if (res.success) {
        toast(res.message, {
          duration: 3000,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        });
        setPassword("");
        setUsername("");
        setForm("otp");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Error signing up", {
        duration: 5000,
        style: {
          backgroundColor: "#EE4B2B",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    // replace with actual OTP verification logic
    try {
      setLoading(true);
      const userEmail = email;
      if (!userEmail) throw new Error("Error Getting User Info");
      const res = await verifyEmail(userEmail, otp);

      if (res.success) {
        toast("OTP verified successfully", {
          duration: 3000,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        });
        setForm("login");
        setOtp("");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Error Verifying Email", {
        duration: 3000,
        style: {
          backgroundColor: "#EE4B2B",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        throw new Error(res.error);
      }
      if (res?.ok) {
        toast("Logged in successfully", {
          duration: 3000,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        });
        setEmail("");
        setPassword("");
        router.replace("/play");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "email_not_verified") {
        toast("Please verify your email first", {
          duration: 5000,
          style: {
            backgroundColor: "#EE4B2B",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        });
        setForm("otp");
        // send otp to email
        sendOtpToEmail(email);
      } else {
        toast(error instanceof Error ? error.message : "Error signing in", {
          duration: 5000,
          style: {
            backgroundColor: "#EE4B2B",
            color: "white",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form === "signup") {
      handleSignup();
    } else if (form === "otp") {
      handleOtpVerify();
    } else {
      handleSignIn();
    }
  };

  const sendOtpToEmail = async (email: string) => {
    try {
      await sendOtp(email);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Error sending OTP", {
        duration: 5000,
        style: {
          backgroundColor: "#EE4B2B",
          color: "white",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <StyledButtonPrimary>
          <div className="relative flex items-center justify-center gap-3">
            <Swords className="size-4 sm:size-5 md:size-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="drop-shadow-lg">JOIN THE BATTLE</span>
            <Swords className="size-4 sm:size-5 md:size-6 group-hover:-rotate-12 transition-transform duration-300" />
          </div>
        </StyledButtonPrimary>
      </DialogTrigger>
      <DialogContent
        className="border-2 border-amber-900 bg-transparent/40 text-white 
        p-6 rounded-none backdrop-blur-lg shadow-md font-secondary"
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600" />
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {form === "login"
              ? "Login"
              : form === "otp"
                ? "Verify Your Email"
                : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        {form === "otp" && (
          <DialogDescription className="text-sm text-amber-300">
            An otp has been sent to your email
          </DialogDescription>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {form === "otp" && (
            <div className="space-y-6">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-14 text-center text-white text-xl bg-amber-800/20
              border-x-0 border-t-0 border-b border-amber-900 rounded-sm 
              focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-center">
                Didn&apos;t receive the OTP?{" "}
                <span
                  className="text-amber-300 font-bold cursor-pointer hover:underline"
                  onClick={() => sendOtpToEmail(email)}
                >
                  Resend OTP
                </span>
              </p>
            </div>
          )}
          {form === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Create a username"
                required
                className="placeholder:uppercase border-x-2 border-t-0 border-b-0 rounded-none border-amber-900 w-full p-4 md:p-6 bg-amber-800/20
                text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          )}
          {form !== "otp" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="placeholder:uppercase border-x-2 border-t-0 border-b-0 rounded-none border-amber-900 w-full p-4 md:p-6 bg-amber-800/20
                text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold">
                  Password
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="placeholder:uppercase border-x-2 border-t-0 border-b-0 rounded-none border-amber-900 w-full p-4 md:p-6 bg-amber-800/20
                text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="size-5 text-amber-800" />
                    ) : (
                      <Eye className="size-5 text-amber-800" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
          <DialogFooter className="mt-4">
            <div className="flex flex-col w-full">
              <PrimaryButton type="submit" disabled={loading}>
                {loading && <Swords className="animate-pulse " />}
                {!loading &&
                  (form === "login"
                    ? "Login"
                    : form === "otp"
                      ? "Verify"
                      : "Sign Up")}
              </PrimaryButton>
              {form !== "otp" && (
                <div>
                  <p className="text-sm text-center mt-6">
                    {form === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <span
                          className="text-amber-300 font-bold cursor-pointer hover:underline"
                          onClick={() => setForm("signup")}
                        >
                          Sign up
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <span
                          className="text-amber-300 font-bold cursor-pointer hover:underline"
                          onClick={() => setForm("login")}
                        >
                          Login
                        </span>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinButton;
