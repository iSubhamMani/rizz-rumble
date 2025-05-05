import React from "react";

const OpponentChatMessage = ({ message }: { message: string }) => {
  return (
    <div
      className="rounded-md uppercase transition-all duration-200 ease-in-out w-full border border-white text-white font-bold p-4 bg-red-500/10
      shadow-[0_0_10px_#FF3131,0_0_4px_#FF3131] text-xs max-w-sm"
    >
      <p>{message}</p>
    </div>
  );
};

export default OpponentChatMessage;
