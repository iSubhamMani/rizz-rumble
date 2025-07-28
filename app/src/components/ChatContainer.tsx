"use client";

import { useSocket } from "@/context/SocketContext";
import { IPlayer } from "@/app/(main)/battle/[id]/page";

interface ChatContainerProps {
  currentPlayer: IPlayer;
}

const ChatContainer = ({ currentPlayer }: ChatContainerProps) => {
  const { chatMessages } = useSocket();

  return (
    <div className="py-4 px-2 flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
      {chatMessages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === currentPlayer._id ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] p-3 rounded-lg ${
              msg.sender === currentPlayer._id
                ? "bg-orange-500/20 text-white border border-orange-500/30"
                : "bg-white/10 text-white border border-white/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1"></div>
            <p className="text-sm">{msg.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
