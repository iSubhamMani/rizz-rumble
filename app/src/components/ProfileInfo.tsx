/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "./ui/badge";

const ProfileInfo = ({ props }: { props: string }) => {
  const user = JSON.parse(props);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white/30">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="bg-purple-600 text-white text-xl">
                PB
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Player One</h3>
              <Badge
                variant="secondary"
                className="bg-orange-500/20 text-orange-300 border-orange-500/30"
              >
                Level 15
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm md:text-base">
          <div className="flex justify-between">
            <span className="text-white/70">Wins</span>
            <span className="font-semibold">47</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Win Rate</span>
            <span className="font-semibold">73%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Rank</span>
            <span className="font-semibold text-yellow-400">#12</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
