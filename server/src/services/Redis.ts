import { Redis } from "ioredis";

class RedisService {
  private pub: Redis;
  private sub: Redis;
  private store: Redis;

  constructor() {
    this.pub = new Redis(process.env.REDIS_URL!);
    this.sub = new Redis(process.env.REDIS_URL!);
    this.store = new Redis(process.env.REDIS_URL!);
  }

  public getSubscriber() {
    return this.sub;
  }

  public getPublisher() {
    return this.pub;
  }

  public async getWaitingPlayer() {
    return this.store.get("waitingPlayer");
  }

  public async setWaitingPlayer(player_id: string, socket_id: string) {
    return this.store.set(
      "waitingPlayer",
      JSON.stringify({ player_id, socket_id }),
      "EX",
      70,
      "NX"
    );
  }

  public async clearWaitingPlayer() {
    return this.store.del("waitingPlayer");
  }

  public async publishMatchFound(
    player1_id: string,
    socket_id: string,
    player2: any
  ) {
    return this.pub.publish(
      "game:matchmaking",
      JSON.stringify({
        player1: { player_id: player1_id, socket_id },
        player2,
      })
    );
  }
}

export default RedisService;
