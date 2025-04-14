import { Server, Socket } from "socket.io";
import { Redis } from "ioredis";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const waitingLobby = new Redis(process.env.REDIS_URL!);
const pub = new Redis(process.env.REDIS_URL!);
const sub = new Redis(process.env.REDIS_URL!);

class SocketService {
  private _io: Server;
  private matchmakingTimeouts = new Map<string, NodeJS.Timeout>();

  constructor() {
    console.log("Socket Service initialized");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
        //credentials: true,
      },
    });

    sub.subscribe("game:matchmaking");
  }

  get io() {
    return this._io;
  }

  private async tryMatchmaking(player_id: string, socket: Socket) {
    try {
      // check if redis has a waiting player
      const waitingPlayer = await waitingLobby.get("waitingPlayer");

      if (!waitingPlayer) {
        // if not, add the player to redis
        const player = {
          player_id,
          socket_id: socket.id,
        };

        const success = await waitingLobby.set(
          "waitingPlayer",
          JSON.stringify(player),
          "EX",
          70, // expire in 70 seconds
          "NX"
        );

        if (success) {
          console.log("Added player to waiting lobby", player_id);

          // add a timeout to remove the player from waiting lobby

          const matchmakingTimeout = setTimeout(async () => {
            const stillWaiting = await waitingLobby.get("waitingPlayer");

            if (stillWaiting) {
              const waitingPlayerInfo = JSON.parse(stillWaiting);

              if (waitingPlayerInfo.player_id === player_id) {
                const socketToNotify = this._io.sockets.sockets.get(
                  waitingPlayerInfo.socket_id
                );

                if (socketToNotify) {
                  socketToNotify.emit("error:matchmakingTimeout");
                  await waitingLobby.del("waitingPlayer");
                }
              }
            }

            this.matchmakingTimeouts.delete(socket.id);
          }, 60 * 1000); // 60 seconds

          this.matchmakingTimeouts.set(socket.id, matchmakingTimeout);

          return;
        }

        // means another player is already waiting
        const newWaitingPlayer = await waitingLobby.get("waitingPlayer");
        if (!newWaitingPlayer) return;

        const waitingPlayerInfo = JSON.parse(newWaitingPlayer);

        if (waitingPlayerInfo.player_id === player_id) {
          const playerSocket = this._io.sockets.sockets.get(socket.id);
          if (playerSocket) playerSocket.emit("error:alreadyInLobby");
          return;
        }

        await pub.publish(
          "game:matchmaking",
          JSON.stringify({
            player1: { player_id, socket_id: socket.id },
            player2: waitingPlayerInfo,
          })
        );

        await waitingLobby.del("waitingPlayer");
      } else {
        console.log("Match found");
        // if yes, create a game and publish the event
        const waitingPlayerInfo = JSON.parse(waitingPlayer);

        if (waitingPlayerInfo.player_id === player_id) {
          const playerSocket = this._io.sockets.sockets.get(socket.id);
          if (playerSocket) playerSocket.emit("error:alreadyInLobby");
          return;
        }

        await pub.publish(
          "game:matchmaking",
          JSON.stringify({
            player1: { player_id, socket_id: socket.id },
            player2: waitingPlayerInfo,
          })
        );

        await waitingLobby.del("waitingPlayer");
      }
    } catch (error) {
      console.error("Error in matchmaking", error);
      const playerSocket = this._io.sockets.sockets.get(socket.id);
      if (playerSocket) playerSocket.emit("error:matchmaking");
      return;
    }
  }

  private async emitMatchFound(message: string) {
    const parsedMessage = JSON.parse(message);
    const { player1, player2 } = parsedMessage;
    const player1Socket = this._io.sockets.sockets.get(player1.socket_id);
    const player2Socket = this._io.sockets.sockets.get(player2.socket_id);

    const roomId = uuid();

    if (player1Socket) {
      player1Socket.emit("event:matchFound", {
        opponent: player2,
        roomId,
      });
    }

    if (player2Socket) {
      player2Socket.emit("event:matchFound", {
        opponent: player1,
        roomId,
      });
    }
  }

  public initListeners() {
    const io = this._io;

    io.on("connect", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("event:matchmaking", (message) => {
        let parsed;
        try {
          parsed = typeof message === "string" ? JSON.parse(message) : message;
        } catch (e) {
          console.error("Failed to parse message", e);
          return;
        }

        const { player_id } = parsed;
        this.tryMatchmaking(player_id, socket);
      });

      socket.on("disconnect", async () => {
        console.log("Client disconnected", socket.id);
        // Clean up if the disconnecting socket is the one in lobby
        const waitingPlayer = await waitingLobby.get("waitingPlayer");
        if (
          waitingPlayer &&
          JSON.parse(waitingPlayer).socket_id === socket.id
        ) {
          await waitingLobby.del("waitingPlayer");
          console.log("Removed disconnected player from waiting lobby");
        }

        // Clear the matchmaking timeout
        const timeout = this.matchmakingTimeouts.get(socket.id);
        if (timeout) {
          clearTimeout(timeout);
          this.matchmakingTimeouts.delete(socket.id);
          console.log("Cleared matchmaking timeout for", socket.id);
        }
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "game:matchmaking") {
        // broadcast this message to both player
        this.emitMatchFound(message);
      }
    });
  }
}

export default SocketService;
