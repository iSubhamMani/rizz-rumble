import { v4 as uuid } from "uuid";
import { MatchModel, MatchStatus } from "../models/Match";
import { connectDB } from "./Db";
import { Player } from "./Matchmaking";
import RedisService from "./Redis";
import { Socket } from "socket.io";
import AiService from "./Ai";

interface IResponse {
  player_id: string;
  response: string;
}

export interface IRoundDetails {
  challenge: string;
  responses: Record<string, IResponse>;
  winner: string | null;
}

interface MatchState {
  players: Player[];
  matchId: string;
  roundDetails: Record<number, IRoundDetails>;
  currentRound: number;
  overallWinner: string | null;
}

class MatchService {
  private AiService: AiService;

  constructor(private redis: RedisService, private _io: Socket["server"]) {
    this.AiService = new AiService();
  }

  public async createMatch(player1_id: string, player2_id: string) {
    await connectDB();
    try {
      const matchId = uuid();

      await MatchModel.create({
        matchId,
        users: [player1_id, player2_id],
        status: MatchStatus.IN_PROGRESS,
        winner: null,
      });

      return matchId;
    } catch {
      return null;
    }
  }

  public async createMatchState(
    matchId: string,
    player1: Player,
    player2: Player
  ) {
    const initialState: MatchState = {
      players: [player1, player2],
      matchId,
      roundDetails: {
        1: {
          challenge: "The Ultimate Heist",
          responses: {},
          winner: "",
        },
      },
      currentRound: 1,
      overallWinner: "",
    };
    await this.redis.Store.set(
      matchId,
      JSON.stringify(initialState),
      "EX",
      60 * 15
    );
    this.redis.Publisher.publish("game:startRound", matchId);
  }

  public async startRound(matchId: string) {
    const matchState = await this.redis.Store.get(matchId);

    if (!matchState) {
      console.log("Match state not found");
      return;
    }

    const parsedMatchState = JSON.parse(matchState) as MatchState;
    const { players } = parsedMatchState;

    setTimeout(() => {
      // round end emit to both players
      const player1Socket = this._io.sockets.sockets.get(players[0].socket_id);
      const player2Socket = this._io.sockets.sockets.get(players[1].socket_id);

      const player1_id = players[0].player_id;
      const player2_id = players[1].player_id;

      //console.log("Sockets:", player1Socket, player2Socket);

      if (player1Socket) {
        player1Socket.emit("event:roundEnd", {
          matchId,
          player_id: player1_id,
          roundNumber: parsedMatchState.currentRound,
        });
      }

      if (player2Socket) {
        player2Socket.emit("event:roundEnd", {
          matchId,
          player_id: player2_id,
          roundNumber: parsedMatchState.currentRound,
        });
      }
    }, 60 * 1000);
  }

  public async handleRoundResponse(message: any) {
    const parsed = typeof message === "string" ? JSON.parse(message) : message;
    const { matchId, player_id, response, roundNumber } = parsed;

    try {
      const updateScript = `
            local matchId = KEYS[1]
            local playerId = ARGV[1]
            local playerResponse = ARGV[2]
            local roundNum = ARGV[3]
            
            -- Get current state
            local currentState = redis.call('GET', matchId)
            if not currentState then
              return {err = "Match not found"}
            end
            
            -- Parse the match state
            local matchState = cjson.decode(currentState)
            
            -- Ensure the round exists (using string key)
            if not matchState.roundDetails[roundNum] then
              return {err = "Round not found"}
            end
            
            -- Initialize responses object if it doesn't exist
            if not matchState.roundDetails[roundNum].responses then
              matchState.roundDetails[roundNum].responses = {}
            end
            
            -- Add/update the player's response
            matchState.roundDetails[roundNum].responses[playerId] = {
              player_id = playerId,
              response = playerResponse
            }
            
            -- Save the updated state back to Redis
            redis.call('SET', matchId, cjson.encode(matchState))
            
            -- Count the number of responses to check if both players have responded
            local responseCount = 0
            for _ in pairs(matchState.roundDetails[roundNum].responses) do
              responseCount = responseCount + 1
            end
            
            return responseCount
          `;

      const responseCount = await this.redis.Store.eval(
        updateScript,
        1,
        matchId, // KEYS[1]
        player_id, // ARGV[1]
        response, // ARGV[2]
        roundNumber.toString() // ARGV[3]
      );
      // Check if both players have responded
      if (responseCount === 2) {
        console.log("Both players have responded. Pushing to queue");
        // push to queue for judge
        await this.redis.Queue.lpush("game:judgeQueue", matchId);
      }
    } catch (error) {
      console.error("Error handling round response:", error);
    }
  }

  public async handleJudgeComplete(message: any) {
    const parsed = typeof message === "string" ? JSON.parse(message) : message;
    const { matchId, newRound, winner, reason } = parsed;
    console.log("Judge complete: ", parsed);

    // TODO: handle errors

    if (!matchId) return;
    const matchState = await this.redis.Store.get(matchId);

    if (!matchState) {
      console.log("Match state not found");
      return;
    }

    let { players } = JSON.parse(matchState);

    const player1Socket = this._io.sockets.sockets.get(players[0].socket_id);
    const player2Socket = this._io.sockets.sockets.get(players[1].socket_id);

    if (newRound > 3) {
      // TODO: handle end of match
      console.log("Match ended");
      if (player1Socket) {
        player1Socket.emit("event:matchEnd", {
          matchId,
          winner,
          reason,
        });
      }
      if (player2Socket) {
        player2Socket.emit("event:matchEnd", {
          matchId,
          winner,
          reason,
        });
      }
    } else {
      // emit to both players
      console.log("Round result");
      if (player1Socket) {
        player1Socket.emit("event:roundResult", {
          matchId,
          nextRound: newRound,
          winner,
          reason,
        });
      }

      if (player2Socket) {
        player2Socket.emit("event:roundResult", {
          matchId,
          nextRound: newRound,
          winner,
          reason,
        });
      }

      await this.redis.Publisher.publish("game:startRound", matchId);
    }
  }
}

export default MatchService;
