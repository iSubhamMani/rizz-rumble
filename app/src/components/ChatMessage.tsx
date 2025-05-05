import React from "react";

const ChatMessage = ({ message }: { message: string }) => {
  return (
    <div
      className="self-end rounded-md uppercase transition-all duration-200 ease-in-out w-full border border-white text-white font-bold p-4 bg-violet-500/10
        shadow-[0_0_10px_#8b5cf6,0_0_4px_#8b5cf6] text-xs max-w-sm"
    >
      <p>{message}</p>
    </div>
  );
};

export default ChatMessage;
