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
  inMatchmaking: boolean;
  matchFound: boolean;
  matchmakingError: string | null;
  matchmakingTimeout: boolean;
  roomId: string | null;
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
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [matchmakingTimeout, setMatchmakingTimeout] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const startMatchmaking: SocketContextType["startMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket) {
        setMatchFound(false);
        setMatchmakingError(null);
        setMatchmakingTimeout(false);
        setRoomId(null);
        socket.emit("event:matchmaking", { player_id });
        setInMatchmaking(true);
      }
    },
    [socket]
  );

  const onMatchFound = useCallback((matchInfo: any) => {
    setInMatchmaking(false);

    const { roomId } = matchInfo as { roomId: string };

    if (roomId) {
      setRoomId(roomId);
      setMatchFound(true);
    }
  }, []);

  const onMatchmakingError = useCallback(() => {
    setMatchFound(false);
    setInMatchmaking(false);
    setMatchmakingError("Matchmaking error");
  }, []);

  const onMatchmakingTimeout = useCallback(() => {
    setMatchFound(false);
    setInMatchmaking(false);
    setMatchmakingTimeout(true);
  }, []);

  const onAlreadyInLobby = useCallback(() => {
    setMatchFound(false);
    setInMatchmaking(false);
    setMatchmakingError("You are already in a lobby");
  }, []);

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    _socket.on("event:matchFound", onMatchFound);
    _socket.on("error:matchmaking", onMatchmakingError);
    _socket.on("error:matchmakingTimeout", onMatchmakingTimeout);
    _socket.on("error:alreadyInLobby", onAlreadyInLobby);

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("event:matchFound", onMatchFound);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        startMatchmaking,
        inMatchmaking,
        matchFound,
        matchmakingError,
        roomId,
        matchmakingTimeout,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
