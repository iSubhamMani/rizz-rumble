/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ButtonPrimary from "./ButtonPrimary";
import { useRef, useState } from "react";
import Image from "next/image";
import { Swords, Upload } from "lucide-react";

const TopPlayerInfo = ({ props }: { props: string }) => {
  const user = JSON.parse(props);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="max-w-xs z-50 cursor-pointer flex items-start gap-4">
          <Avatar className="text-black size-12">
            <AvatarImage src={user.avatarUrl || "/default_avatar.jpg"} />
            <AvatarFallback>TN</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-sm font-bold line-clamp-1">{user.username}</h1>
            <p className="w-[120px] text-xs text-center rounded-full border-2 px-2 py-1 border-violet-400">
              Level 12
            </p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="border border-violet-300 bg-black/40 text-white 
            p-6 rounded-lg backdrop-blur-lg shadow-md"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            Profile details
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="flex gap-4">
              <div className="w-full flex items-center justify-center rounded-full overflow-hidden">
                <Image
                  src={user.avatarUrl || "/default_avatar.jpg"}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="w-40 h-40 rounded-full object-cover"
                />
              </div>
              <div className="w-full">
                <p className="text-sm font-bold">
                  <Swords className="inline mr-2 size-4" />
                  {user.username}
                </p>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                  ref={fileInputRef}
                />
                {/* Custom styled button with icon */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex gap-4 mt-4 items-center justify-center w-full p-3 bg-black/40 border-b border-violet-500 rounded-sm cursor-pointer hover:bg-violet-900/50 transition-colors"
                >
                  <span className="text-sm">Upload Avatar</span>
                  <Upload className="text-violet-400 size-4" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <div className="flex flex-col w-full">
              <ButtonPrimary>Save</ButtonPrimary>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopPlayerInfo;
