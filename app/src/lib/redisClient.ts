import { Redis } from "ioredis";

class RedisService {
  private store: Redis;

  constructor() {
    this.store = new Redis(process.env.REDIS_URL!);
  }

  public get Store() {
    return this.store;
  }
}

export const redis = new RedisService();
