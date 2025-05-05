import { Server } from "socket.io";
import dotenv from "dotenv";
import RedisService from "./Redis";
import MatchService from "./Match";
import MatchmakingService from "./Matchmaking";
import { checkForValidUser } from "../utils/validUser";
dotenv.config();

class SocketService {
  private _io: Server;
  private redis;
  private matchService;
  private matchmakingService;

  constructor() {
    console.log("Socket Service initialized");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
        //credentials: true,
      },
    });

    this.redis = new RedisService();
    this.matchService = new MatchService(this.redis, this._io);
    this.matchmakingService = new MatchmakingService(
      this._io,
      this.redis,
      this.matchService
    );

    this.redis.Subscriber.subscribe("game:matchmaking");
    this.redis.Subscriber.subscribe("game:startRound");
    this.redis.Subscriber.subscribe("game:judgeComplete");
    this.redis.Subscriber.subscribe("game:initialChallengeGenerated");
    this.redis.Subscriber.subscribe("game:opponentResponse");
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this._io;

    io.on("connect", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("event:matchmaking", async (message) => {
        let parsed;
        try {
          parsed = typeof message === "string" ? JSON.parse(message) : message;
        } catch (e) {
          console.error("Failed to parse message", e);
          return;
        }

        const { player_id } = parsed;

        checkForValidUser(player_id, socket);

        this.matchmakingService.handleMatchmaking(player_id, socket);
      });

      socket.on("event:roundResponse", async (message) => {
        this.matchService.handleRoundResponse(message);
      });

      socket.on("event:cancelMatchmaking", async (message) => {
        this.matchmakingService.cancelMatchmaking(message, socket);
      });

      socket.on("disconnect", async () => {
        console.log("Client disconnected", socket.id);
        // Clean up if the disconnecting socket is the one in lobby
        const waitingPlayer = await this.redis.WaitingPlayer;
        if (
          waitingPlayer &&
          JSON.parse(waitingPlayer).socket_id === socket.id
        ) {
          await this.redis.clearWaitingPlayer();
          console.log("Removed disconnected player from waiting lobby");
        }

        // Clear the matchmaking timeout
        this.matchmakingService.clearMatchmakingTimeout(socket.id);
      });
    });

    this.redis.Subscriber.on("message", (channel, message) => {
      switch (channel) {
        case "game:matchmaking":
          this.matchmakingService.handleMatchFound(message);
          break;
        case "game:startRound":
          this.matchService.startRound(message);
          break;
        case "game:judgeComplete":
          this.matchService.handleJudgeComplete(message);
          break;
        case "game:initialChallengeGenerated":
          this.matchService.initGame(message);
          break;
        case "game:opponentResponse":
          this.matchService.handleOpponentResponse(message);
          break;
      }
    });
  }
}

export default SocketService;
