require('dotenv').config();
const { default: mongoose } = require('mongoose');
const configAdmin = require('../configadmin');
const staff = require('../models/staff');
const clients = require('../models/client');
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { signInToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helpers');
const redisClient = require('../helpers/redis_init');

let crypto;
crypto = require('node:crypto'); // For random generation of bytes
try {} catch (err) {
  console.error('crypto support is disabled!');
}

exports.grantLoginAccessToAdmin = async (req, res, next) => {
    const { accessCode } = req.body;
    try {
        if (!accessCode) throw createError.BadRequest("Access code is required!");
        if (accessCode !== configAdmin.accessCode) throw createError.Unauthorized('Please, enter correct access code.');
        return res.status(200).json({ redirectUrl: 'http://localhost:3000/loginAdmin', message: 'You are now redirected to admin login page',  success: true });
        // Route user to login page
        // res.redirect(301, 'http://localhost:3000/loginAdmin');
    } catch (error) {
        next(error)
    }
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).json({ message: "Both username and password are required", success: false })

        const usernameInLowerCase = username.toLowerCase();
        if (usernameInLowerCase === configAdmin.username && password === configAdmin.password){

            // Generate login access token
            const payload = { _id: configAdmin.id, username: configAdmin.username, name: configAdmin.name, iss: 'Wealth Affairs Inc', aud: 'Admin' };
            console.log('1= ' + payload)
            const loginToken = await signInToken(payload);
            const refreshToken = await signRefreshToken(payload)
            
            // res.set('Authorization', `Bearer ${loginToken}`);            
            // Set login token in client-side cookies as HTTP-only cookie
            // res.cookie('authToken', loginToken, { httpOnly: true });
            return res.status(200).json({ message: 'Login successful...', loginToken, refreshToken, success: true });
        } else {
            return res.status(401).json({ message: 'Invalid credentials. Please, enter correct username and password.', success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error. Please try again.', success: false });
    }
};

exports.refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest('Refresh token is missing');
        // Verify the refresh token if it is valid
        const userPayload = await verifyRefreshToken(refreshToken);
        const loginToken = await signInToken(userPayload);
        const refreshLoginToken = await signRefreshToken(userPayload);
        res.set('Authorization', `Bearer ${loginToken}`);
        return res.status(200).json({ message: 'Your browsing session has been extended.', loginToken, refreshLoginToken, userPayload, success: true })
    } catch (error) {
        next(error)
    }
}

exports.logoutAdmin = async (req, res) => {
    res.removeHeader('Authorization'); // This will clear the token in authorization header if response header is used to store the login token
    res.status(200).json({ message: 'You are now logged out.' })
}

exports.createStaffUser = async (req, res) => {
    // Grant access to only admin
    // if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    let { firstname, middlename, lastname, phoneno, role } = req.body;
    const companydomainmail = '@wealthaffairs.com';

    // Confirm roles
    if (role === 'FA') role = 'Fund Administrator';
    else if (role === 'FC') role = 'Fund Controller';
    else if (role === 'RM') role = 'Relationship Manager';
    else return res.status(404).json({ message: 'Staff role is not assigned'});


    // Generate email for staff
    const staffEmail = `${firstname.toLowerCase().slice(0,1)}${middlename.toLowerCase().slice(0,1)}${lastname.toLowerCase().slice(0,1)}${phoneno.toLowerCase().slice(-3)}${companydomainmail}`;
    
    // Generate password for staff
    const generatePassword = () => {
        const passwordLength = 8;
        const characters = '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const randomBytes = crypto.randomBytes(passwordLength);
        const passoutcome = new Array(passwordLength)
        const charactersLength = characters.length;
        // console.log(randomBytes, passoutcome, charactersLength)

        // Generate random characters and store it inside passoutcome
        for (let index = 0; index < passwordLength; index++) {
            passoutcome[index] = characters[randomBytes[index] % charactersLength];   
        }
        return passoutcome.join('')
    }
    const staffPassword = await generatePassword()

    const staffData = {
        firstname, middlename, lastname, role, 
        phoneNo: phoneno, 
        email: staffEmail,  
        password: staffPassword
    }

    // Check if phone number or email already exists in the db
    const existingStaffInfo = await staff.findOne({ $or: [{ email: staffEmail}, { phoneNo: phoneno }]})
    
    if (existingStaffInfo){
        if (existingStaffInfo.phoneNo === phoneno){
            res.status(409).json({ message: 'Phone number already exists.'});
            return;
        }
        if (existingStaffInfo.email === staffEmail){
            res.status(409).json({ message: 'Email already exists.'});
            return;
        }
    }

    // Save staff to the database
    try {
        const createStaff = await new staff(staffData).save();
        const staffAddedToDb = await staff.findById(createStaff._id).select('-password');
        return res.status(200).json({
            message: 'Staff created successfully.',
            staffAddedToDb,
            password: staffPassword
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message })
    }
};

exports.getAllStaff =  async (req, res) => {
    try {
        // Grant access to only admin
        if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
        // const staffList = await staff.find().select('-password -role -email'); // Exclude multiple fields
        // const staffList = await staff.find({}, {password: 0, role: 0, firstname: 0}); // Exclude multiple fields
        const staffList = await staff.find().select('-password');
        if (staffList.length === 0) return res.status(200).json({ message: 'No staff found!'})
        else {
            console.log(staffList.length)
            return res.status(200).json({ message: 'Staff list displayed below', data: req.user, staffList })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}. Please try again...` });
    }
}

exports.getStaffById =  async (req, res) => {
    const staffId = req.params.id;
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(400).json({ message: 'Invalid Staff ID'})
        const staffInfo = await staff.findById(staffId).select('-password');
        if (!staffInfo) return res.status(404).json({message: 'Staff not found!'});
        return res.status(200).json({ staffInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

exports.editStaff =  async (req, res) => {
    const staffId = req.params.id;
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(400).json({ message: 'Invalid ID' })

        if (req.body.role === 'FA') role = 'Fund Administrator';
        else if (req.body.role === 'FC') role = 'Fund Controller';
        else if (req.body.role === 'RM') role = 'Relationship Manager';
        else return res.status(404).json({ message: 'Role Not Assigned'});
        
        const modifiedStaffInfo = {...req.body, role: role};
        const updateStaffInfo = await staff.findByIdAndUpdate(staffId, modifiedStaffInfo, { new: true }).select('-password');
        if (updateStaffInfo === null) return res.status(404).json({ message: 'Staff ID does not exists in the database' });
        return res.status(200).json({ message: 'Profile updated.', updateStaffInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

exports.deleteStaff =  async (req, res) => {
    const staffId = req.params.id;
    // Grant access to only admin
    // if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(400).json({ message: 'Invalid ID' });
        const deleteStaffProfile = await staff.findByIdAndDelete(staffId);
        if (deleteStaffProfile === null) return res.status(404).json({ message: 'Staff profile does not exists in the database' });
        return res.status(200).json({ message: 'Staff account deleted!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

exports.getClients =  async (req, res) => {
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Please, login as an admin to access this page' });
    try {
        const allClients = await clients.find().select('-password');
        if (allClients.length === 0) return res.status(200).json({ message: 'No registered client yet!'});
        return res.status(200).json({ count: `${allClients.length}`, allClients })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

exports.getClientById =  async (req, res) => {
    const clientId = req.params.id;
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Please, login as an admin to access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(400).json({ message: 'Invalid Client ID'});
        const clientInfo = await clients.findById(clientId).select('-password');
        if (!clientInfo) return res.status(404).json({message: 'Client not found!'});
        return res.status(200).json({ clientInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

exports.editClient =  async (req, res) => {
    const clientId = req.params.id;
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Please, login as an admin to access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(401).json({ message: 'Invalid Client ID'});

        const clientDataToModify = {...req.body};
        const updateClientData = await clients.findByIdAndUpdate(clientId, clientDataToModify, { new: true });
        if (!updateClientData) return res.status(404).json({ message: 'Client not found', success: false })
        return res.status(201).json({ message: 'Client profile has been updated', success: true })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

exports.deleteClient =  async (req, res) => {
    const clientId = req.params.id;
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Please, login as an admin to access this page' });
    try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(401).json({ message: 'Invalid Client ID'});
        const deleteClientProfile = await clients.findByIdAndDelete(clientId);
        if (deleteClientProfile === null) return res.status(404).json({ message: 'Client profile does not exists in the database' });
        return res.status(200).json({ message: 'Client account has been deleted!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};