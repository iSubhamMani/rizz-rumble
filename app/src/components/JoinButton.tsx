"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Swords } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

const JoinButton = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="uppercase animate-bounce mt-8 border border-white font-bold text-sm sm:text-base p-6 
             text-white hover:bg-white hover:text-violet-500 
             bg-transparent relative z-10 
             shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6] 
             hover:shadow-[0_0_20px_#8b5cf6,0_0_40px_#8b5cf6] 
             "
        >
          <Swords className="size-6 mr-2 hover:text-violet-500  drop-shadow-[0_0_6px_#8b5cf6]" />
          <span>Join the battle</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border border-violet-300 bg-black/40 text-white 
        p-6 rounded-lg backdrop-blur-lg shadow-md"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Login
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-bold">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="border-x-0 border-t-0 border-b rounded-sm border-violet-500 uppercase w-full p-3 bg-black/80
                text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                placeholder="Password"
                className="border-x-0 border-t-0 border-b rounded-sm border-violet-500 placeholder:uppercase w-full p-3 bg-black/80
                    text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff className="size-5 text-violet-500" />
                ) : (
                  <Eye className="size-5 text-violet-500" />
                )}
              </button>
            </div>
          </div>
        </form>
        <DialogFooter className="mt-4">
          <div className="flex flex-col w-full">
            <Button
              type="submit"
              className="uppercase w-full border border-white text-white font-bold py-5 bg-transparent
                  hover:bg-white hover:text-violet-500 shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6]"
            >
              Login
            </Button>
            <div>
              <p className="text-sm text-center mt-6">
                Don&apos;t have an account?{" "}
                <span className="text-violet-400 font-bold cursor-pointer hover:underline">
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinButton;
