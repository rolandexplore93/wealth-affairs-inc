const { createClient } = require('redis');
const redisClient = createClient();

redisClient.connect(console.log('Client connected to redis...'));

redisClient.on('ready', () => {
    console.log('Client connected to Redis and ready to use...');
});

redisClient.on('error', (err) => {
    console.log('err.message');
});

process.on('SIGINT', () => {
    redisClient.disconnect();
});

redisClient.on('end', () => {
    console.log('Client disconnected from Redis.');
});

module.exports = redisClient; 