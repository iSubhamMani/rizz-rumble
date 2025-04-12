import ButtonPrimary from "@/components/ButtonPrimary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Send, Swords } from "lucide-react";
import React from "react";

const Battle = () => {
  return (
    <div className="flex flex-col h-screen text-white relative overflow-hidden">
      {/* Background with a dark base and radial gradient for light convergence */}
      <div
        className="absolute inset-0 -z-50"
        style={{
          background: `
              radial-gradient(
                circle at 120% 50%, 
                rgba(167, 139, 250, 0.9) 20%, 
                rgba(84, 67, 135, 0.9) 30%, 
                rgba(0, 0, 0, 1.0) 80%, 
                #000000 80%
              )
            `,
        }}
      />

      {/* Content */}
      <main className="flex gap-6 px-8 py-6 h-screen">
        <div className="flex-[2] h-full flex flex-col">
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              <Avatar className="text-black cursor-pointer">
                <AvatarImage src={"/default_avatar.jpg"} />
                <AvatarFallback>TN</AvatarFallback>
              </Avatar>
              <div className="text-start">
                <p className="text-base font-bold tracking-widest">
                  <span className="inline size-4"></span>
                  Player 1
                </p>
                <p className="text-xs font-light">Rank 45</p>
              </div>
            </div>
            <Swords className="text-white size-7" />
            <div className="flex gap-4">
              <div className="text-end">
                <p className="text-base font-bold tracking-widest">
                  <span className="inline size-4"></span>
                  You
                </p>
                <p className="text-xs font-light">Rank 45</p>
              </div>
              <Avatar className="text-black cursor-pointer">
                <AvatarImage src={"/default_avatar.jpg"} />
                <AvatarFallback>TN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex-1 max-w-4xl px-4 mt-6 flex flex-col">
            <div className="flex-1">Chat container</div>
            <div className="flex items-start overflow-hidden gap-4">
              <Textarea
                className="border border-violet-300 bg-black/40 text-white rounded-lg shadow-md h-24 resize-none
              focus-visible:ring-0 focus-visible:outline-none scrollbar-hide"
                placeholder="Type your prompt here..."
              />
              <ButtonPrimary className="max-w-12">
                <Send />
              </ButtonPrimary>
            </div>
          </div>
        </div>
        <div
          className="flex-1 border border-violet-300 bg-black/40 text-white 
            p-6 rounded-lg backdrop-blur-lg shadow-md"
        >
          <h1 className="text-xl font-bold">Battle Log</h1>
        </div>
      </main>
    </div>
  );
};

export default Battle;
