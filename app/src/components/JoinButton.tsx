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
        <button
          className="flex items-center justify-self-center fade-pullup mt-2 rounded-full border border-gray-200 font-bold text-sm sm:text-base p-4 sm:p-6 
             text-black
             bg-white relative z-10 
             group
             hover:shadow-[0_0_20px_#fff,0_0_40px_#f97316] 
             transition-all duration-200 ease-in-out"
        >
          <Swords className="size-6 mr-2 group-hover:rotate-12 transition-all duration-300 ease-in-out" />
          <span>Join the battle</span>
          <Swords className="size-6 ml-2 group-hover:-rotate-12 transition-all duration-300 ease-in-out" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="border border-violet-300
        p-6 rounded-lg shadow-md bg-white/10 backdrop-blur-lg border-white/20 text-white"
      >
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
          <DialogDescription className="text-sm">
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
                      className="w-12 h-14 text-center text-white text-xl bg-white/10 
              border-x-0 border-t-0 border-b border-white rounded-sm 
              focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-center">
                Didn&apos;t receive the OTP?{" "}
                <span
                  className="text-violet-400 font-bold cursor-pointer hover:underline"
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
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Create a username"
                required
                className="border-x-0 border-t-0 border-b rounded-sm border-white w-full p-3 bg-white/10
                text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          )}
          {form !== "otp" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-bold">
                  Email
                </Label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border-x-0 border-t-0 border-b rounded-sm border-white w-full p-3 bg-white/10
                text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold">
                  Password
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border-x-0 border-t-0 border-b rounded-sm border-white w-full p-3 bg-white/10
                text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="size-5 text-white" />
                    ) : (
                      <Eye className="size-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
          <DialogFooter className="mt-4">
            <div className="flex flex-col w-full">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full flex items-center justify-center border border-gray-200 font-bold text-xs sm:text-sm p-4 
             text-black
             bg-white relative z-10 
             group
             hover:shadow-[0_0_8px_#fff,0_0_10px_#f97316] transition-all duration-200 ease-in-out"
              >
                {loading && (
                  <Swords className="animate-pulse size-4 sm:size-5" />
                )}
                {!loading &&
                  (form === "login"
                    ? "Login"
                    : form === "otp"
                      ? "Verify"
                      : "Sign Up")}
              </button>
              {form !== "otp" && (
                <div>
                  <p className="text-sm text-center mt-6 ">
                    {form === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <span
                          className="text-purple-400 font-bold cursor-pointer hover:underline"
                          onClick={() => setForm("signup")}
                        >
                          Sign up
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <span
                          className="text-violet-400 font-bold cursor-pointer hover:underline"
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
