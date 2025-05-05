"use client";

import { useSocket } from "@/context/SocketContext";
import ChatMessage from "./ChatMessage";
import OpponentChatMessage from "./OpponentChatMessage";
import { IPlayer } from "@/app/(main)/battle/[id]/page";

interface ChatContainerProps {
  currentPlayer: IPlayer;
}

const ChatContainer = ({ currentPlayer }: ChatContainerProps) => {
  const { chatMessages } = useSocket();

  return (
    <div className="py-4 px-2 flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
      {chatMessages.map((msg, index) => {
        return msg.sender === currentPlayer._id ? (
          <ChatMessage key={index} message={msg.message} />
        ) : (
          <OpponentChatMessage key={index} message={msg.message} />
        );
      })}
    </div>
  );
};

export default ChatContainer;
