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
          challenge: "Generate a storyline for a movie",
          responses: {},
          winner: "",
        },
      },
      currentRound: 1,
      overallWinner: "",
    };
    await this.redis.Store.set(matchId, JSON.stringify(initialState));
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
}

export default MatchService;
