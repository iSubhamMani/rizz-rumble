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
import ButtonPrimary from "./PrimaryButton";
import { useRef, useState } from "react";
import Image from "next/image";
import { Swords, Upload } from "lucide-react";

const ProfileInfo = ({ props }: { props: string }) => {
  const user = JSON.parse(props);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1">
      <div
        className={`group relative px-6 py-4 
                    bg-transparent/40
            border-4 border-amber-900 
            rounded-none
            font-secondary text-sm sm:text-lg md:text-xl text-amber-100
            shadow-lg
            wood-texture
            max-w-sm mx-auto
          `}
      >
        {/* Wood grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-800/20 to-amber-900/40 rounded-none" />
        {/* Metal corner brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600" />

        {/* Hover glow effect */}
      </div>
    </div>
  );
};

export default ProfileInfo;
