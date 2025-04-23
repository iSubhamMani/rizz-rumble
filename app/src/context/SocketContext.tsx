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
  matchId: string | null;
  startMatchmaking: (player_id: string) => any;
  cancelMatchmaking: (player_id: string) => any;
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
  const [matchId, setMatchId] = useState<string | null>(null);

  const startMatchmaking: SocketContextType["startMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket) {
        setMatchFound(false);
        setMatchmakingError(null);
        setMatchmakingTimeout(false);
        setMatchId(null);
        socket.emit("event:matchmaking", { player_id });
        setInMatchmaking(true);
      }
    },
    [socket]
  );

  const cancelMatchmaking: SocketContextType["cancelMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket) {
        socket.emit("event:cancelMatchmaking", { player_id });
        setInMatchmaking(false);
        setMatchFound(false);
        setMatchmakingError(null);
        setMatchmakingTimeout(false);
        setMatchId(null);
      }
    },
    [socket]
  );

  const onMatchFound = useCallback((matchInfo: any) => {
    setInMatchmaking(false);

    const { matchId } = matchInfo as { matchId: string };

    if (matchId) {
      setMatchId(matchId);
      setMatchFound(true);
    }
  }, []);

  const onMatchmakingError = useCallback(() => {
    setMatchFound(false);
    setInMatchmaking(false);
    setMatchmakingError(
      "An error occurred while matchmaking. Please try again."
    );
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

  const onUnauthorized = useCallback((socket: Socket) => {
    setMatchFound(false);
    setInMatchmaking(false);
    setMatchmakingError("You are not authorized to play");
    setMatchmakingTimeout(false);
    setMatchId(null);
    disconnectSocket(socket);
  }, []);

  const disconnectSocket = useCallback(
    (_socket: Socket) => {
      if (socket) {
        _socket.disconnect();
        _socket.off("error:unauthorized", onUnauthorized);
        _socket.off("event:matchFound", onMatchFound);
        _socket.off("error:matchmaking", onMatchmakingError);
        _socket.off("error:matchmakingTimeout", onMatchmakingTimeout);
        _socket.off("error:alreadyInLobby", onAlreadyInLobby);
        setSocket(undefined);
      }
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    _socket.on("error:unauthorized", onUnauthorized);
    _socket.on("event:matchFound", onMatchFound);
    _socket.on("error:matchmaking", onMatchmakingError);
    _socket.on("error:matchmakingTimeout", onMatchmakingTimeout);
    _socket.on("error:alreadyInLobby", onAlreadyInLobby);

    setSocket(_socket);

    return () => {
      disconnectSocket(_socket);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        startMatchmaking,
        cancelMatchmaking,
        inMatchmaking,
        matchFound,
        matchmakingError,
        matchId,
        matchmakingTimeout,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
