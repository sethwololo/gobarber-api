import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

import AppError from '@shared/errors/AppError';

import cacheConfig from '@config/cache';

const redisClient = new Redis(cacheConfig.config.redis);

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    const secs = Math.round(err.msBeforeNext / 1000) || 1;
    response.set('Retry-After', String(secs));
    throw new AppError('Too many requests', 429);
  }
}
