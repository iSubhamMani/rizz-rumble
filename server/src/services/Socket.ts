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
        console.log("Round response received");

        const parsed =
          typeof message === "string" ? JSON.parse(message) : message;
        const { matchId, player_id, response, roundNumber } = parsed;

        try {
          // Adjusted Lua script for your specific data structure
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

          // Execute the Lua script with ioredis
          const responseCount = await this.redis.Store.eval(
            updateScript,
            1, // Number of keys
            matchId, // KEYS[1]
            player_id, // ARGV[1]
            response, // ARGV[2] - no need to stringify if it's already a string
            roundNumber.toString() // ARGV[3] - ensure roundNumber is a string
          );

          console.log(
            `Response saved successfully. Response count: ${responseCount}`
          );

          // Check if both players have responded
          if (responseCount === 2) {
            console.log("Both players have responded. Sending to judge");
            // Publish to judge event here
            // For example:
            // await this.redis.Store.publish('judge:evaluate', JSON.stringify({matchId, roundNumber}));
          }
        } catch (error) {
          console.error("Error handling round response:", error);
        }
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
      if (channel === "game:matchmaking") {
        // broadcast this message to both player
        this.matchmakingService.handleMatchFound(message);
      } else if (channel === "game:startRound") {
        this.matchService.startRound(message);
      }
    });
  }
}

export default SocketService;
