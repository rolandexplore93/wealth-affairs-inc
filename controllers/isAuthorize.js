// require('dotenv').config(); // Access environment variables
// const jwt = require('jsonwebtoken');

// // Middleware to authorize FA
// exports.isAuthorize = async (req, res, next) => {
//     const retrieveLoginToken = req.headers.authorization;
//     if (!retrieveLoginToken) return res.status(401).json({ message: 'Missing authorisation token' });
//     const accessLoginToken = retrieveLoginToken.slice(8, -1);
//     console.log(accessLoginToken)

//     jwt.verify(accessLoginToken, process.env.SECRETJWT, (err, decoded) => {
//         if (err) return res.status(401).json({ message: `Token has expired... ${err.message}` });
//         // Valid token, store the data received in the 'request' body(user) and proceed to the next middleware
//         req.user = decoded;
//         next();
//     });
// };