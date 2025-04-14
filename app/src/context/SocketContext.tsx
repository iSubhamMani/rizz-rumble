/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

interface SocketContextType {
  startMatchmaking: (player_id: string) => any;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Socket context not found");
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  const startMatchmaking: SocketContextType["startMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket) {
        socket.emit("event:matchmaking", { player_id });
      }
    },
    [socket]
  );

  const onMatchFound = useCallback((matchInfo: any) => {
    console.log("Match found", matchInfo);
    // Handle the match found event
  }, []);

  useEffect(() => {
    console.log("SOCKET RUNNING ON: ", process.env.NEXT_PUBLIC_BACKEND_URL);
    const _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    _socket.on("event:matchFound", onMatchFound);

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("event:matchFound", onMatchFound);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ startMatchmaking }}>
      {children}
    </SocketContext.Provider>
  );
};
