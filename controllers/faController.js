require('dotenv').config(); // Access environment variables
const { default: mongoose } = require('mongoose');
const staff = require('../models/staff');
const jwt = require('jsonwebtoken');
const investment = require('../models/investment');

exports.authFa = async (req, res) => {
    // console.log(req.user);
    res.status(200).json({ message: `Welcome to FA page`, data: req.user });
};

exports.authFc = async (req, res) => {
    // console.log(req.user);
    res.status(200).json({ message: `Welcome to FC page`, data: req.user });
};

exports.authRm = async (req, res) => {
    // console.log(req.user);
    res.status(200).json({ message: `Welcome to RM page`, data: req.user });
};

// Middleware to authorise FA
// exports.authoriseStaff = async (req, res, next) => {
//     const retrieveLoginToken = req.headers.authorization;
//     if (!retrieveLoginToken) return res.status(401).json({ message: 'Missing authorisation token' });
//     const accessLoginToken = retrieveLoginToken.slice(8, -1);

//     try {
//         // Verify and decode the token to get user data stored in it
//         const decodedLoginToken = await jwt.verify(accessLoginToken, process.env.SECRETJWT);
//         const staffId = decodedLoginToken._id;
//         const staffRole = decodedLoginToken.role;

//         // Check staff role for access permission to their respective page
//         if (staffRole === 'Fund Administrator'){
//             // Access granted to FA. Store FA id inside request body
//             req.staffId = staffId;
//             next();
//         } else if (staffRole === 'Fund Controller'){
//             // Access granted to FC. Store FC id inside request body
//             req.staffId = staffId;
//             next();
//         } else if (staffRole === 'Relationship Manager'){
//             // Access granted to RM. Store RM id inside request body
//             req.staffId = staffId;
//             next();
//         } else {
//             // Staff cannot access the page. Output an error response to the user
//             return res.status(403).json({ message: 'Access Denied...',  decodedLoginToken})
//         };
//     } catch (error) {
//         if (error.message === "jwt expired") return res.status(401).json({ errorMessage: 'Expired token', message: error.message});
//         return res.status(500).json({ message: error.message});
//     }
// };

// Create an investment
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
    } else if(riskLevel == 5) {
        riskLevelBrief = 'Suitable for very aggressive investors';
        riskLevelDescription = 'Investors who are prepared to accept large portfolio losses up to the value of their entire portfolio over a one year period and are generally willing to buy investments or enter into contracts that may be difficult to sell or close for an extended period or have an uncertain realizable value at any given time.';
    } else {
        return res.status(400).json({ message: 'Please select risk level' })
    };

    const investmentBody = { investmentDisplayName, investmentName, primaryAssetType, secondaryAssetType,
        industry, country, region, issuer, stockExchange, currency, unit, closingPrice, priceClosingDate,
        maturityDate, coupon, riskLevel, riskLevelBrief, riskLevelDescription, 
        createdByStaff:  req.body.createdByStaff || null,
        decidedByStaff:  req.body.decidedByStaff || null,
    }

    try {
        const investmentData = await new investment(investmentBody);
        const createdInvestment = await investmentData.save();
        return res.status(200).json({ message: "Investment has been created...", createdInvestment });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// View all investments
exports.allInvestments = async (req, res) => {
    try {
        const investments = await investment.find();
        if (!investments) return res.status(400).json({ message: `No Investment Found.` })
        return res.status(200).json({ investments })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// Sort: view APPROVED investments
exports.approvedInvestments = async (req, res) => {
    try {
        const approvedInvestments = await investment.findOne({ status: 'APPROVED'});
        if (!approvedInvestments) return res.status(400).json({ message: `No Approved Investment Found.` })
        return res.status(200).json({ approvedInvestments })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// Sort: view PENDING investments
exports.pendingInvestments = async (req, res) => {
    try {
        const pendingInvestments = await investment.findOne({ status: 'PENDING'});
        if (!pendingInvestments) return res.status(400).json({ message: `No Pending Investment Found.` })
        return res.status(200).json({ pendingInvestments })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// Sort: view REJECTED investments
exports.rejectedInvestments = async (req, res) => {
    try {
        const rejectedInvestments = await investment.findOne({ status: 'REJECTED'});
        if (!rejectedInvestments) return res.status(400).json({ message: `No Rejected Investment Found.` })
        return res.status(200).json({ rejectedInvestments })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// View each investment
exports.viewTargetInvestment = async (req, res) => {
    const investmentId = req.params.id;
    try {
        const investments = await investment.findById(investmentId);
        if (!investments) return res.status(400).json({ message: `No Investment Found.` })
        return res.status(200).json({ investments })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

// Edit an investment
exports.editInvestment = async (req, res) => {
    const investmentId = req.params.id;
    const { investmentDisplayName, investmentName, primaryAssetType, secondaryAssetType,
        industry, country, region, issuer, stockExchange, currency, unit, closingPrice, priceClosingDate,
        maturityDate, coupon, riskLevel
    } = req.body
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
    } else if(riskLevel == 5) {
        riskLevelBrief = 'Suitable for very aggressive investors';
        riskLevelDescription = 'Investors who are prepared to accept large portfolio losses up to the value of their entire portfolio over a one year period and are generally willing to buy investments or enter into contracts that may be difficult to sell or close for an extended period or have an uncertain realizable value at any given time.';
    } else {
        return res.status(400).json({ message: 'Please select risk level' })
    };

    const investmentData = { ...req.body, riskLevelBrief, riskLevelDescription, 
        createdByStaff:  req.body.createdByStaff || null, 
        decidedByStaff:  req.body.decidedByStaff || null, 
    };

    try {
        if (!mongoose.Types.ObjectId.isValid(investmentId)) return res.status(404).json({ message: 'Invalid ID' });
        const existingInvestment = await investment.findById(investmentId);
        if (!existingInvestment) return res.status(400).json({ message: 'Investment ID does not exists in the database' });
        const getInvestment = await investment.findOne({ _id: investmentId, status: 'PENDING'});
        if (!getInvestment) return res.status(404).json({ message: 'This Investment has been decided by the Relationship Manager. It cannot be updated again' });
        getInvestment.set(investmentData);
        const updateInvestment = await getInvestment.save();
        return res.status(200).json({ message: `${updateInvestment.investmentName} investment has been updated`, updateInvestment });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}