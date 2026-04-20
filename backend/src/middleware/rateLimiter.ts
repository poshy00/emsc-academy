import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

let redisClient: RedisClientType | null = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch(console.error);
}

/**
 * General rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  store: redisClient ? new RedisStore({ client: redisClient }) : undefined,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter - stricter for login/register
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: redisClient ? new RedisStore({ client: redisClient }) : undefined,
  message: { error: 'Demasiados intentos, intenta en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Payment rate limiter
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  store: redisClient ? new RedisStore({ client: redisClient }) : undefined,
  message: { error: 'Demasiados intentos de pago, intenta en 1 hora' },
  standardHeaders: true,
  legacyHeaders: false,
});
