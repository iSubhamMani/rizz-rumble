import { Redis } from "ioredis";

class RedisService {
  private pub: Redis;
  private sub: Redis;
  private queue: Redis;
  private store: Redis;

  constructor() {
    this.pub = new Redis(process.env.REDIS_URL!);
    this.sub = new Redis(process.env.REDIS_URL!);
    this.queue = new Redis(process.env.REDIS_URL!);
    this.store = new Redis(process.env.REDIS_URL!);

    this.sub.subscribe("game:initialChallenge");
  }

  public get Publisher() {
    return this.pub;
  }

  public get Subscriber() {
    return this.sub;
  }

  public get Queue() {
    return this.queue;
  }

  public get Store() {
    return this.store;
  }
}

export default RedisService;
