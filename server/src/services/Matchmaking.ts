import { Socket } from "socket.io";
import RedisService from "./Redis";
import MatchService from "./Match";

interface Player {
  player_id: string;
  socket_id: string;
}

class MatchmakingService {
  private _matchmakingTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    private _io: Socket["server"],
    private redis: RedisService,
    private matchService: MatchService
  ) {}

  public async handleMatchmaking(player_id: string, socket: Socket) {
    try {
      // check if redis has a waiting player
      const waitingPlayer = await this.redis.getWaitingPlayer();

      if (!waitingPlayer) {
        // if not, add the player to redis

        const success = await this.redis.setWaitingPlayer(player_id, socket.id);

        if (success) {
          console.log("Added player to waiting lobby", player_id);

          // add a timeout to remove the player from waiting lobby

          const matchmakingTimeout = setTimeout(async () => {
            const stillWaiting = await this.redis.getWaitingPlayer();

            if (stillWaiting) {
              const waitingPlayerInfo = JSON.parse(stillWaiting);

              if (waitingPlayerInfo.player_id === player_id) {
                const socketToNotify = this._io.sockets.sockets.get(
                  waitingPlayerInfo.socket_id
                );

                if (socketToNotify) {
                  socketToNotify.emit("error:matchmakingTimeout");
                  await this.redis.clearWaitingPlayer();
                }
              }
            }

            this._matchmakingTimeouts.delete(socket.id);
          }, 60 * 1000); // 60 seconds

          this._matchmakingTimeouts.set(socket.id, matchmakingTimeout);

          return;
        }

        // means another player is already waiting
        const newWaitingPlayer = await this.redis.getWaitingPlayer();
        if (!newWaitingPlayer) return;

        const waitingPlayerInfo = JSON.parse(newWaitingPlayer);

        if (waitingPlayerInfo.player_id === player_id) {
          const playerSocket = this._io.sockets.sockets.get(socket.id);
          if (playerSocket) playerSocket.emit("error:alreadyInLobby");
          return;
        }

        this.redis.publishMatchFound(player_id, socket.id, waitingPlayerInfo);
        await this.redis.clearWaitingPlayer();
      } else {
        console.log("Match found");
        // if yes, create a game and publish the event
        const waitingPlayerInfo = JSON.parse(waitingPlayer) as Player;

        if (waitingPlayerInfo.player_id === player_id) {
          const playerSocket = this._io.sockets.sockets.get(socket.id);
          if (playerSocket) playerSocket.emit("error:alreadyInLobby");
          return;
        }

        this.redis.publishMatchFound(player_id, socket.id, waitingPlayerInfo);
        await this.redis.clearWaitingPlayer();
      }
    } catch (error) {
      console.error("Error in matchmaking", error);
      const playerSocket = this._io.sockets.sockets.get(socket.id);
      if (playerSocket) playerSocket.emit("error:matchmaking");
      return;
    }
  }

  public async handleMatchFound(message: string) {
    const parsedMessage = JSON.parse(message);
    const { player1, player2 } = parsedMessage as {
      player1: Player;
      player2: Player;
    };
    const player1Socket = this._io.sockets.sockets.get(player1.socket_id);
    const player2Socket = this._io.sockets.sockets.get(player2.socket_id);

    const matchId = await this.matchService.createMatch(
      player1.player_id,
      player2.player_id
    );

    if (!matchId) {
      console.error("Error creating match");
      if (player1Socket) player1Socket.emit("error:matchmaking");
      if (player2Socket) player2Socket.emit("error:matchmaking");
      return;
    }

    if (player1Socket) {
      player1Socket.emit("event:matchFound", {
        matchId,
      });
    }

    if (player2Socket) {
      player2Socket.emit("event:matchFound", {
        matchId,
      });
    }
  }

  public async cancelMatchmaking(message: any, socket: Socket) {
    const parsed = typeof message === "string" ? JSON.parse(message) : message;
    const { player_id } = parsed;

    // Clear the matchmaking timeout
    const timeout = this._matchmakingTimeouts.get(socket.id);
    if (timeout) {
      clearTimeout(timeout);
      this._matchmakingTimeouts.delete(socket.id);
      console.log("Cleared matchmaking timeout for", socket.id);
    }

    // Remove the player from waiting lobby
    const waitingPlayer = await this.redis.getWaitingPlayer();
    if (waitingPlayer) {
      const waitingPlayerInfo = JSON.parse(waitingPlayer);
      if (waitingPlayerInfo.player_id === player_id) {
        await this.redis.clearWaitingPlayer();
        console.log("Removed player from waiting lobby", player_id);
      }
    }
  }

  public clearMatchmakingTimeout(socketId: string) {
    const timeout = this._matchmakingTimeouts.get(socketId);
    if (timeout) {
      clearTimeout(timeout);
      this._matchmakingTimeouts.delete(socketId);
    }
  }
}

export default MatchmakingService;
