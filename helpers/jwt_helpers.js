require('dotenv').config(); // Access environment variables
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('./redis_init');

module.exports = {
    signInToken:  (payload) => {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.SECRETJWT;
            const options = { expiresIn: '10m'}
            JWT.sign(payload, secretKey, options, (err, token) => {
                if (err) reject(createError.InternalServerError());
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
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Session token has expired. Please, login again'
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
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESHTOKENSECRETJWT, (err, payload) => {
                if (err) {
                    const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Session token has expired. Please, login again'
                    return reject(createError.Unauthorized(message));
                }
                const userId = payload._id

                redisClient.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return
                    };

                    if (refreshToken === result) return resolve(userId);
                    reject(createError.Unauthorized());
                })
                resolve(user)
            })
        })
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
