require('dotenv').config(); // Access environment variables
const staff = require('../models/staff');
const jwt = require('jsonwebtoken');
const investment = require('../models/investment');


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
    const { investmentDisplayName, investmentName, primaryAssetType, secondaryAssetType,
        industry, country, region, issuer, stockExchange, currency, unit, closingPrice, priceClosingDate,
        maturityDate, coupon, riskLevel
    } = req.body;

    // Assigned respective risk level information to investment risk level
    let riskLevelBrief;
    let riskLevelDescription;
    if (riskLevel == 1){
        riskLevelBrief = 'Suitable for very conservative investors';
        riskLevelDescription = 'Investors who hope to experience minimal fluctuations in portfolio value over a rolling one year period and are generally only willing to buy investments that are priced frequently and have a high certainty of being able to sell quickly (less than a week) at a price close to the recently observed market value.';
    } else if(riskLevel == 2) {
        riskLevelBrief = 'Suitable for conservative investors';
        riskLevelfDescription = 'Investors who hope to experience no more than small portfolio losses over a rolling one-year period and are generally only willing to buy investments that are priced frequently and have a high certainty of being able to sell quickly (less than a week) although the investor may at times buy individual investments that entail greater risk.';
    } else if(riskLevel == 3) {
        riskLevelBrief = 'Suitable for moderate investors';
        riskLevelDescription = 'Investors who hope to experience no more than moderate portfolio losses over a rolling one year period in attempting to enhance longer-term performance and are generally willing to buy investments that are priced frequently and have a high certainty of being able to sell quickly (less than a week) in stable markets although the investor may at times buy individual investments that entail greater risk and are less liquid.';
    } else if(riskLevel == 4) {
        riskLevelBrief = 'Suitable for aggressive investors';
        riskLevelDescription = 'Investors who are prepared to accept greater portfolio losses over a rolling one year period while attempting to enhance longer-term performance and are willing to buy investments or enter into contracts that may be difficult to sell or close within a short time-frame or have an uncertain realizable value at any given time.';
    } else {
        riskLevelBrief = 'Suitable for very aggressive investors';
        riskLevelDescription = 'Investors who are prepared to accept large portfolio losses up to the value of their entire portfolio over a one year period and are generally willing to buy investments or enter into contracts that may be difficult to sell or close for an extended period or have an uncertain realizable value at any given time.';
    };

    const investmentBody = { investmentDisplayName, investmentName, primaryAssetType, secondaryAssetType,
        industry, country, region, issuer, stockExchange, currency, unit, closingPrice, priceClosingDate,
        maturityDate, coupon, riskLevel, riskLevelBrief, riskLevelDescription, 
        createdByStaff:  req.body.createdByStaff || null, 
        decidedByStaff:  req.body.decidedByStaff || null, 
    }
    // console.log(req.body)

    try {
        const investmentData = await new investment(investmentBody);
        const createdInvestment = await investmentData.save();
        return res.status(200).json({ message: "Investment has been created...", createdInvestment })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};