require('dotenv').config(); // Access environment variables
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('./redis_init');

module.exports = {
    signInToken:  (payload) => {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.SECRETJWT;
            const options = { expiresIn: '30m'}
            JWT.sign(payload, secretKey, options, (err, token) => {
                if (err) reject(createError.InternalServerError(err.message));
                resolve(token);
            })
        })
    },
    isAuthorize: async (req, res, next) => {
        const retrieveLoginToken = req.headers.authorization;
        if (!retrieveLoginToken) return next(createError.Unauthorized());
        const accessLoginToken = retrieveLoginToken.split(' ')[1];
    
        JWT.verify(accessLoginToken, process.env.SECRETJWT, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Session timeout. Please, login again'
                return next(createError.Unauthorized(message));
            }
            req.user = payload;
            next();
        });
    },
    signRefreshToken: (payload) => {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.REFRESHTOKENSECRETJWT;
            const options = { expiresIn: '1d'}
            JWT.sign(payload, secretKey, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError())
                };
                // Save the return token inside redis cache. The expiry time is in seconds
                redisClient.SET(payload._id, token, { 'EX': 1 * 24 * 60 * 60 }, (err, reply) => { // reply is sent from redis
                    if (err) { // If there is an error, you want to reject the call/promise //or you do not want to sign the token. or you do not want to resolve the promise with the token. Instead you want 
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                })
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        try {
            return JWT.verify(refreshToken, process.env.REFRESHTOKENSECRETJWT, async (err, payload) => {
                if (err) {
                    const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Session token has expired. Please, login again'
                    throw createError.Unauthorized(message);
                }
                const userId = payload._id
                // Compare the new refresh token with the token inside redis
                const refreshTokenStoredInRedis = await redisClient.get(userId)
                if (refreshToken !== refreshTokenStoredInRedis) throw createError.Conflict('Token does not match or exist!');
                const payloadToSendBack = {
                    _id: payload._id,
                    username: payload.username,
                    name: payload.name,
                    iss: payload.iss,
                    aud: payload.aud,
                }
                return payloadToSendBack
            })
        } catch (error) {
            console.log(error.message)
        }
    }
}











































// module.exports = {
//     signInToken: (userId, payload, options) => {
//         return new Promise((resolve, reject) => {
//             // const payload = data;
//             // console.log(payload)
//             const secret = process.env.SECRETJWT;
//             // const options = {
//             //     expiresIn: '15m'
//             // };
//             JWT.sign(payload, secret, options, (err, token) => {
//                 if (err) reject(err);
//                 resolve(token);
//             });
//         });
//     }
// };
