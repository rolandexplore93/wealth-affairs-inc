const { createClient } = require('redis'); 
const redisClient = createClient();



// module.exports = {

// }

// const REDIS_PORT = process.env.PORT || 6379;
// const client = redis.createClient({
//     port: 6379,
//     host: "127.0.0.1"
// }); // if nothing is provided, redis will connect to the client hosted locally on the machine

// redisClient.on('connect', () => {
//     console.log('Client connected to redis...')
// });

// client.on('ready', () => {
//     console.log('Client connected to redis and ready to use...')
// });

redisClient.on('error', (err) => {
    console.log(err.message)
});

redisClient.connect('hh')

// client.on('end', () => {
//     console.log('Client disconnected from redis.')
// });

// process.on('SIGINT', () => {
//     client.quit()
// });

// console.log('jjj')

module.exports = redisClient;

