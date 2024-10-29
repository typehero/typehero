import { createClient, type RedisClientType } from '@redis/client';

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
};

// Persist the client across hot reloads in dev mode
const client =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          console.log('Too many attempts to reconnect. Redis connection was terminated');
          return new Error('Too many retries.');
        }
        return retries * 500;
      },
      connectTimeout: 10000,
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = client;

if (!client.isOpen) {
  await client.connect();
}

client.on('error', (error) => console.error('Redis client error:', error));

export { client as redisClient };
