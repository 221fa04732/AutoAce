import type { RedisOptions } from 'bullmq'
import dotenv from 'dotenv'

dotenv.config()

export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
};

