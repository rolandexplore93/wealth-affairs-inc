const staff = require('../models/staff');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Access environment variables


exports.authFa = async (req, res) => {
    res.status(200).json({ message: `Welcome to FA page`});
};

exports.authFc = async (req, res) => {
    res.status(200).json({ message: `Welcome to FC page`});
};

exports.authRm = async (req, res) => {
    res.status(200).json({ message: `Welcome to RM page`});
};

// Middleware to authorise FA
exports.authoriseStaff = async (req, res, next) => {
    const retrieveLoginToken = req.headers.authorization.slice(8, -1);
    if (!retrieveLoginToken) return res.status(401).json({ message: 'Missing authorisation token' });

    try {
        // Verify and decode the token to get user data stored in it
        const decodedLoginToken = await jwt.verify(retrieveLoginToken, process.env.SECRETJWT);
        const staffId = decodedLoginToken._id;
        const staffRole = decodedLoginToken.role;

        // Check staff role for access permission to their respective page
        if (staffRole === 'Fund Administrator'){
            // Access granted to FA. Store FA id inside request body
            req.staffId = staffId;
            next();
        } else if (staffRole === 'Fund Controller'){
            // Access granted to FC. Store FC id inside request body
            req.staffId = staffId;
            next();
        } else if (staffRole === 'Relationship Manager'){
            // Access granted to RM. Store RM id inside request body
            req.staffId = staffId;
            next();
        } else {
            // Staff cannot access the page. Output an error response to the user
            return res.status(403).json({ message: 'Access Denied...',  decodedLoginToken})
        };
    } catch (error) {
        if (error.message === "jwt expired") return res.status(401).json({ errorMessage: 'Expired token', message: error.message});
        return res.status(500).json({ message: error.message});
    }
};

exports.createInvestment = async (req, res) => {

};