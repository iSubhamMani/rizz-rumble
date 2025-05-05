/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
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

interface ChatMessage {
  sender: string;
  message: string;
}

interface SocketContextType {
  inMatchmaking: boolean;
  matchFound: boolean;
  isMatchEnd: boolean;
  matchmakingError: string | null;
  matchmakingTimeout: boolean;
  matchId: string | null;
  challenge: string | null;
  initialChallenge: string | null;
  winner: string | null;
  reason: string | null;
  roundNumber: number;
  resetTimer: boolean;
  judging: boolean;
  chatMessages: ChatMessage[];
  isPromptSubmitted: boolean;
  startMatchmaking: (player_id: string) => any;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  cancelMatchmaking: (player_id: string) => any;
  setInitialChallenge: (challenge: string | null) => void;
  setIsPromptSubmitted: (isSubmitted: boolean) => void;
  submittedPrompt: RefObject<string>;
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
  const socket = useRef<Socket | undefined>(undefined);
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [matchmakingTimeout, setMatchmakingTimeout] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [isMatchEnd, setIsMatchEnd] = useState(false);
  const submittedPrompt = useRef<string>("");
  const [resetTimer, setResetTimer] = useState(false);
  const [judging, setJudging] = useState(false);
  const [initialChallenge, setInitialChallenge] = useState<string | null>(null);
  const [isPromptSubmitted, setIsPromptSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const onRoundEnd = useCallback(
    (matchInfo: any) => {
      setResetTimer(false);
      setJudging(true);
      if (socket.current) {
        const res = submittedPrompt.current;
        const { matchId, player_id, roundNumber } = matchInfo as {
          matchId: string;
          player_id: string;
          roundNumber: number;
        };
        // collect the response and send it to the server
        const message = {
          matchId,
          player_id,
          response: res,
          roundNumber,
        };
        socket.current.emit("event:roundResponse", JSON.stringify(message));
      }
    },
    [socket]
  );

  const onRoundResult = useCallback(
    (matchInfo: any) => {
      const { nextRound, winner, reason, newChallenge } = matchInfo;

      if (roundNumber < 3) setRoundNumber(nextRound);
      setWinner(winner);
      setReason(reason);
      setChallenge(newChallenge);
      setResetTimer(true);
      setIsPromptSubmitted(false);
      submittedPrompt.current = "";
      setJudging(false);
    },
    [roundNumber]
  );

  const onMatchEnd = useCallback((matchInfo: any) => {
    const { winner } = matchInfo;
    setWinner(winner);
    setReason(null);
    setIsMatchEnd(true);
    setJudging(false);
    setMatchFound(false);
    setIsPromptSubmitted(false);
    submittedPrompt.current = "";
    setChallenge(null);
  }, []);

  const startMatchmaking: SocketContextType["startMatchmaking"] = useCallback(
    (player_id: string) => {
      if (socket.current) {
        setMatchFound(false);
        setMatchmakingError(null);
        setMatchmakingTimeout(false);
        setIsMatchEnd(false);
        setChallenge(null);
        setWinner(null);
        setReason(null);
        setRoundNumber(1);
        setInitialChallenge(null);
        setMatchId(null);
        setInMatchmaking(true);
        socket.current.emit("event:matchmaking", JSON.stringify({ player_id }));
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

  const onMatchKickoff = useCallback((matchInfo: any) => {
    const { challenge } = matchInfo;
    console.log("MATCH KICKOFF:", challenge);

    if (challenge) {
      setResetTimer(true);
      setInitialChallenge(challenge);
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

  const onOpponentResponse = useCallback((matchInfo: any) => {
    const { sender, response } = matchInfo;
    setChatMessages((prev) => [...prev, { sender, message: response }]);
  }, []);

  const disconnectSocket = useCallback(
    (_socket: Socket) => {
      if (socket) {
        _socket.disconnect();
        _socket.off("error:unauthorized", onUnauthorized);
        _socket.off("event:matchFound", onMatchFound);
        _socket.off("event:roundResult", onRoundResult);
        _socket.off("event:matchEnd", onMatchEnd);
        _socket.off("event:matchKickoff", onMatchKickoff);
        _socket.off("event:roundEnd", onRoundEnd);
        _socket.off("error:matchmaking", onMatchmakingError);
        _socket.off("error:matchmakingTimeout", onMatchmakingTimeout);
        _socket.off("error:alreadyInLobby", onAlreadyInLobby);
        _socket.off("event:opponentResponse", onOpponentResponse);

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
    _socket.on("event:matchKickoff", onMatchKickoff);
    _socket.on("event:roundEnd", onRoundEnd);
    _socket.on("event:roundResult", onRoundResult);
    _socket.on("event:matchEnd", onMatchEnd);
    _socket.on("event:opponentResponse", onOpponentResponse);

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
        setInitialChallenge,
        setIsPromptSubmitted,
        setChatMessages,
        inMatchmaking,
        isMatchEnd,
        matchFound,
        matchmakingError,
        matchId,
        matchmakingTimeout,
        challenge,
        initialChallenge,
        winner,
        reason,
        roundNumber,
        resetTimer,
        judging,
        chatMessages,
        isPromptSubmitted,
        submittedPrompt,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
