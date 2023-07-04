require('dotenv').config(); // Access environment variables
const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signInToken:  (payload, options) => {
        return  new Promise((resolve, reject) => {
            const secretKey = process.env.SECRETJWT
            JWT.sign(payload, secretKey, options, (err, token) => {
                if (err) reject (err);
                resolve(token);
            })
        })
    },
    isAuthorize: async (req, res, next) => {
        const retrieveLoginToken = req.headers.authorization;
        if (!retrieveLoginToken) return next(createError.Unauthorized());
        const accessLoginToken = retrieveLoginToken.split(' ')[1];
    
        await JWT.verify(accessLoginToken, process.env.SECRETJWT, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Session token has expired. Please, login again'
                return next(createError.Unauthorized(message));
            }
            req.user = payload;
            next();
        });
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
