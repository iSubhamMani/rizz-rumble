import { v4 as uuid } from "uuid";
import { MatchModel, MatchStatus } from "../models/Match";
import { connectDB } from "./Db";
import { Player } from "./Matchmaking";
import RedisService from "./Redis";
import { Socket } from "socket.io";
import AiService from "./Ai";

interface IResponses {
  playerId: string;
  response: string;
}

export interface IRoundDetails {
  roundNumber: number;
  responses: IResponses[];
  winner: string | null;
}

interface MatchState {
  players: Player[];
  matchId: string;
  roundDetails: IRoundDetails[];
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
      roundDetails: [],
      currentRound: 1,
      overallWinner: null,
    };

    await this.redis.MatchState.set(matchId, JSON.stringify(initialState));
  }

  public async startMatch(matchId: string) {
    console.log("Started match timer for matchId:", matchId);
    const interval = setInterval(async () => {
      const stateStr = await this.redis.MatchState.get(matchId);
      if (!stateStr) {
        clearInterval(interval);
        return;
      }

      const state: MatchState = JSON.parse(stateStr);
      console.log("Match timer tick for round:", state.currentRound);

      // Update state: add round data, increment round
      state.roundDetails.push({
        roundNumber: state.currentRound,
        responses: state.players.map((player) => ({
          playerId: player.player_id,
          response: "Sample response",
        })),
        winner: null, // Set winner logic here
      });
      state.currentRound += 1;

      // End match if you have a max round
      if (state.currentRound > 3) {
        clearInterval(interval);
        // judge the response and set the overall winner
        const lastRoundDetails = state.roundDetails[2];
        await this.AiService.judgeResponse(lastRoundDetails);

        // TODO: emit to clients
        const player1Socket = this._io.sockets.sockets.get(
          state.players[0].socket_id
        );
        const player2Socket = this._io.sockets.sockets.get(
          state.players[1].socket_id
        );

        if (player1Socket) {
          player1Socket.emit("event:matchEnd", {
            matchId,
          });
        }

        if (player2Socket) {
          player2Socket.emit("event:matchEnd", {
            matchId,
          });
        }

        await MatchModel.updateOne(
          { matchId },
          {
            status: MatchStatus.COMPLETED,
            winner: state.overallWinner,
          }
        );

        await this.redis.MatchState.del(matchId);
        return;
      }

      await this.redis.MatchState.set(matchId, JSON.stringify(state));

      // TODO: judge and generate the new challenge and emit to clients
      const lastRoundDetails = state.roundDetails[state.currentRound - 1];
      const judgeResponse = await this.AiService.judgeResponse(
        lastRoundDetails
      );
      const response = await this.AiService.generateChallenge();

      const player1Socket = this._io.sockets.sockets.get(
        state.players[0].socket_id
      );
      const player2Socket = this._io.sockets.sockets.get(
        state.players[1].socket_id
      );

      if (player1Socket) {
        player1Socket.emit("event:matchUpdate", {
          matchId,
        });
      }

      if (player2Socket) {
        player2Socket.emit("event:matchUpdate", {
          matchId,
        });
      }
    }, 60 * 1000); // every 60 seconds
  }
}

export default MatchService;
