import { Player } from "./Matchmaking";
import RedisService from "./Redis";
import { Socket } from "socket.io";

const ROUND_TIMEOUT = 92; // seconds

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
  constructor(private redis: RedisService, private _io: Socket["server"]) {}

  public async initGame(matchId: string) {
    const matchState = await this.redis.Store.get(matchId);

    if (!matchState) {
      console.log("Match state not found");
      return;
    }

    const parsedMatchState = JSON.parse(matchState) as MatchState;
    const { players, roundDetails } = parsedMatchState;
    const challenge = roundDetails[1].challenge;

    const player1Socket = this._io.sockets.sockets.get(players[0].socket_id);
    const player2Socket = this._io.sockets.sockets.get(players[1].socket_id);

    if (player1Socket) {
      player1Socket.emit("event:matchKickoff", { challenge });
    }

    if (player2Socket) {
      player2Socket.emit("event:matchKickoff", { challenge });
    }
    await this.redis.Publisher.publish("game:startRound", matchId);
  }

  public async createMatchState(player1: Player, player2: Player) {
    const matchId = [player1.player_id, player2.player_id].sort().join("-");

    // Try to acquire the key only if it doesn't exist
    const acquired = await this.redis.Store.set(
      matchId,
      "LOCKED", // Temporary placeholder
      "EX",
      60 * 15,
      "NX"
    );

    if (acquired === null) {
      // Key already exists, another server already created the match
      console.log("Key already exists");
      return matchId;
    }
    console.log("Key acquired, creating match state");

    const initialState: MatchState = {
      players: [player1, player2],
      matchId,
      roundDetails: {
        1: {
          challenge: "",
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
      60 * 60 * 24
    );

    await this.redis.Publisher.publish("game:initialChallenge", matchId);
    return matchId;
  }

  public async startRound(matchId: string) {
    const matchState = await this.redis.Store.get(matchId);

    if (!matchState) {
      console.log("Match state not found");
      return;
    }

    const parsedMatchState = JSON.parse(matchState) as MatchState;
    const { players } = parsedMatchState;
    console.log("Starting New Round");

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
    }, ROUND_TIMEOUT * 1000);
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

      // send message to other player
      await this.redis.Publisher.publish(
        "game:opponentResponse",
        JSON.stringify({
          sender: player_id,
          message: response,
          matchId,
        })
      );
    } catch (error) {
      console.error("Error handling round response:", error);
    }
  }

  public async handleJudgeComplete(message: any) {
    const parsed = typeof message === "string" ? JSON.parse(message) : message;
    const { matchId, newRound, winner, reason } = parsed;
    console.log(
      "New challenged: ",
      parsed.newChallenge ? parsed.newChallenge : "No new challenge"
    );
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
      console.log("Match ended");

      // calculate overallWinner
      const matchState = await this.redis.Store.get(matchId);
      if (!matchState) {
        console.log("Match state not found");
        return;
      }
      const parsedMatchState = JSON.parse(matchState) as MatchState;
      const { roundDetails } = parsedMatchState;

      const player1Wins = Object.values(roundDetails).filter(
        (round) => round.winner === players[0].player_id
      ).length;

      const player2Wins = Object.values(roundDetails).filter(
        (round) => round.winner === players[1].player_id
      ).length;

      const overallWinner =
        player1Wins > player2Wins
          ? players[0].player_id
          : player1Wins === player2Wins
          ? "none"
          : players[1].player_id;

      if (player1Socket) {
        player1Socket.emit("event:matchEnd", {
          matchId,
          winner: overallWinner,
          reason,
        });
      }
      if (player2Socket) {
        player2Socket.emit("event:matchEnd", {
          matchId,
          winner: overallWinner,
          reason,
        });
      }

      await this.redis.Store.del(matchId);
    } else {
      // emit to both players
      console.log("Round result");
      if (player1Socket) {
        player1Socket.emit("event:roundResult", {
          matchId,
          nextRound: newRound,
          winner,
          reason,
          newChallenge: parsed.newChallenge,
        });
      }

      if (player2Socket) {
        player2Socket.emit("event:roundResult", {
          matchId,
          nextRound: newRound,
          winner,
          reason,
          newChallenge: parsed.newChallenge,
        });
      }

      await this.redis.Publisher.publish("game:startRound", matchId);
    }
  }

  public async handleOpponentResponse(message: any) {
    const parsed = typeof message === "string" ? JSON.parse(message) : message;
    const { sender, message: response, matchId } = parsed;

    const matchState = await this.redis.Store.get(matchId);

    if (!matchState) {
      console.log("Match state not found");
      return;
    }

    const parsedMatchState = JSON.parse(matchState) as MatchState;
    const { players } = parsedMatchState;
    const receiver = players.find(
      (player) => player.player_id !== sender
    )?.socket_id;

    if (receiver) {
      const receiverSocket = this._io.sockets.sockets.get(receiver);
      if (receiverSocket) {
        receiverSocket.emit("event:opponentResponse", {
          sender,
          response,
          matchId,
        });
      }
    }
  }
}

export default MatchService;
