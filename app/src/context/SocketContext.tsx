/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

const sampleResponses = [
  "In the dead of night, my team and I infiltrate the most secure vault in the world. Disguised as maintenance workers, we bypass high-tech security systems with our cutting-edge tools. The mission is clear: steal the priceless diamond without leaving a trace.",
  "As the clock strikes midnight, we stealthily enter the vault, our hearts racing. The diamond glimmers in the dim light, a symbol of our success. With precision and teamwork, we execute our plan flawlessly. The heist is a masterpiece of strategy and skill.",
  "My crew and I don’t need fancy gadgets—we rely on pure skill. We hack into the vault’s surveillance system and disable the cameras. As we slip through the laser grid, every movement counts. But the twist? I’ve planted a tracker on Player 1, ready to double-cross them.",
  "The heist is a game of wits. I’ve studied the vault’s layout for weeks, memorizing every detail. As we enter, I spot a hidden trapdoor. It leads to a secret chamber with the diamond. My crew is in awe, but I know this is just the beginning of our adventure.",
  "In the world of heists, trust is everything. I’ve worked with my crew for years, and we know each other’s strengths and weaknesses. As we navigate the vault, I rely on their expertise to guide us. Together, we’re unstoppable, and the diamond is ours for the taking.",
  "The heist is a test of loyalty. I’ve been betrayed before, and I won’t let it happen again. As we enter the vault, I keep a close eye on my crew. One wrong move, and the plan could fall apart. But I trust them to have my back, just as I have theirs.",
  "As we approach the vault, I can’t help but feel a rush of adrenaline. The diamond is within reach, but so are the guards. I’ve studied their patterns and know when to strike. With a well-timed distraction, we slip past them undetected.",
];

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | undefined>(undefined);
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [matchmakingTimeout, setMatchmakingTimeout] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  const onRoundEnd = useCallback(
    (matchInfo: any) => {
      if (socket.current) {
        const { matchId, player_id, roundNumber } = matchInfo as {
          matchId: string;
          player_id: string;
          roundNumber: number;
        };
        // collect the response and send it to the server
        const randomRes =
          sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        const message = {
          matchId,
          player_id,
          response: randomRes,
          roundNumber,
        };

        socket.current.emit("event:roundResponse", JSON.stringify(message));
      }
    },
    [socket]
  );

  const startMatchmaking: SocketContextType["startMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket.current) {
        setMatchFound(false);
        setMatchmakingError(null);
        setMatchmakingTimeout(false);
        setMatchId(null);
        socket.current.emit("event:matchmaking", JSON.stringify({ player_id }));
        setInMatchmaking(true);
      }
    },
    [socket]
  );

  const cancelMatchmaking: SocketContextType["cancelMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket.current) {
        socket.current.emit(
          "event:cancelMatchmaking",
          JSON.stringify({ player_id })
        );
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
        _socket.off("event:roundEnd", onRoundEnd);
        _socket.off("error:matchmaking", onMatchmakingError);
        _socket.off("error:matchmakingTimeout", onMatchmakingTimeout);
        _socket.off("error:alreadyInLobby", onAlreadyInLobby);
        socket.current = undefined;
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
    _socket.on("event:roundEnd", onRoundEnd);

    socket.current = _socket;

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
