const Redis = require('ioredis')
const { redis } = require('../db/config/configService')


const redisConnect = new Redis(redis.port, redis.host, {
    db: 0,
    showFriendlyErrorStack: true,
    lazyConnect: false,
    maxRetriesPerRequest: 1000,
});

redisConnect
    .on('connect', async () => {
        console.info('✔️  Connected to redis instance');
    })
    .on('ready', () => {
        console.info('✔️  Redis instance is ready (data loaded from disk)');
    })
    .on('error', (e) => {
        console.error(`🔴 Error connecting to redis: "${e}"`);
    })
    .on('close', () => {
        console.error('🔴 Redis close');
    })
    .on('reconnecting', () => {
        console.error('✔️  Redis reconnecting');
    })
    .on('end', () => {
        console.error('🔴 Redis end');
    });

process.on('SIGINT', () => {
    console.error('🔴 Redis SIGINT');
    redisConnect.quit();
});

process.on('SIGTERM', () => {
    console.error('🔴 Redis SIGTERM');
    redisConnect.quit();
});

module.exports = { redisConnect };