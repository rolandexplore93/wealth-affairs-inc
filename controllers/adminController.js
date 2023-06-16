require('dotenv').config(); // Access environment variables
const { default: mongoose } = require('mongoose');
const configAdmin = require('../configadmin');
const bcrypt = require('bcrypt');
const staff = require('../models/staff');
const clients = require('../models/client');
const jwt = require('jsonwebtoken');
const redis = require('redis'); 
const util = require('util');

// Initialize redis port
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
client.set = util.promisify(client.set)
client.get = util.promisify(client.get)


let crypto;
crypto = require('node:crypto'); // For randam generation of bytes
try {
//   console.log(crypto)
} catch (err) {
  console.error('crypto support is disabled!');
}

// Admin login
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const usernameInLowerCase = username.toLowerCase();
    try {
        if (usernameInLowerCase === configAdmin.username && password === configAdmin.password){
            const loginToken = await jwt.sign({ _id: configAdmin.id, username: configAdmin.username, name: configAdmin.name }, process.env.SECRETJWT, { expiresIn: '30s' });
            res.set('Authorization', `Bearer ${loginToken}`);
            // Set login token in client-side cookies as HTTP-only cookie
            // res.cookie('authToken', loginToken, { httpOnly: true });

            // redisClient.set('admin-token', loginToken, "EX", 10) // Store the token in Redis
            client.set(`${configAdmin.id}`, JSON.stringify(loginToken), 'EX', 30);
            return res.status(200).json({ success: true, message: 'Login successful...', loginToken });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials. Please, enter correct username and password.' })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, errorMessage: 'Server Error. Please try again.' });
    }
};

// Cached middleware
// To use the cache middlwware, pass it as a second parameter inside the routes call
function cache(req, res, next){
    const {username } = req.params;
    client.get(username, (err, data) => {
        if (err) throw err;

        if (data !== null){
            // res.send(setResponse(username,data))
            res.send("Data")
        } else {
            next();
        }
    })
}

// Admin logout
exports.logoutAdmin = async (req, res) => {
    res.removeHeader('Authorization'); // This will clear the token in authorization header if response header is used to store the login token
    // res.clearCookie('authToken'); // if cookie is used to store the login token
    // client.del('admin-token');
    res.status(200).json({ message: 'You are now logged out.' })
    // res.redirect('/loginAdmin')  // redirect admin to login page  
}

// Create staff user
exports.createStaffUser = async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
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
    const salt = await bcrypt.genSalt();
    const encryptPassword = await bcrypt.hash(staffPassword, salt)

    const staffData = {
        firstname, middlename, lastname, role, 
        phoneNo: phoneno, 
        email: staffEmail,  
        password: encryptPassword
    }

    // Check if phone number or email already exists in the db
    const existingStaffInfo = await staff.findOne({ $or: [{ email: staffEmail}, { phoneNo: phoneno }]})
    
    if (existingStaffInfo){
        if (existingStaffInfo.phoneNo === phoneno){
            res.status(409).json({ errorMessage: 'Phone number already exists.'});
            return;
        }
        if (existingStaffInfo.email === staffEmail){
            res.status(409).json({ errorMessage: 'Email already exists.'});
            return;
        }
    }

    // Save staff to the database
    try {
        const createStaff = await new staff(staffData);
        const staffAddedToDb = await createStaff.save().select('-password');
        console.log(staffAddedToDb)
        return res.status(200).json({
            message: 'Staff created successfully.',
            staffAddedToDb,
            password: staffPassword
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: error.message })
    }
};

// View all staff users
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
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}. Please try again...` });
    }
}

// View each user (id)
exports.getStaffById =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const staffId = req.params.id;
        // Check if the staff id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(400).json({ message: 'Invalid Staff ID'})
        const staffInfo = await staff.findById(staffId).select('-password');
        if (!staffInfo) return res.status(404).json({message: 'Staff not found!'});
        return res.status(200).json({ staffInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// Modify user details (id)
exports.editStaff =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const staffId = req.params.id;
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
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// View delete user (id)
exports.deleteStaff =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const staffId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(400).json({ message: 'Invalid ID' });
        const deleteStaffProfile = await staff.findByIdAndDelete(staffId);
        if (deleteStaffProfile === null) return res.status(404).json({ message: 'Staff profile does not exists in the database' });
        return res.status(200).json({ message: 'Staff account deleted!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// View all clients
exports.getClients =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const allClients = await clients.find().select('-password');
        if (allClients.length === 0) return res.status(200).json({ message: 'No registered client yet!'});
        return res.status(200).json({ count: `${allClients.length}`, allClients })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// View each client
exports.getClientById =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const clientId = req.params.id;
        // Check if the client id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(400).json({ message: 'Invalid Client ID'});
        const clientInfo = await clients.findById(clientId).select('-password');
        if (!clientInfo) return res.status(404).json({message: 'Client not found!'});
        return res.status(200).json({ clientInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// Modify client details (id)
exports.editClient =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const clientId = req.params.id;
        // Check if the client id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(404).json({ message: 'Invalid Client ID'});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
};

// Delete client
exports.deleteClient =  async (req, res) => {
    // Grant access to only admin
    if (req.user._id !== configAdmin.id && req.user !== configAdmin.username) return res.status(401).json({ message: 'Sorry, only Admin can access this page' });
    try {
        const clientId = req.params.id;
        // Check if the client id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(400).json({ message: 'Invalid Client ID'});
        const deleteClientProfile = await clients.findByIdAndDelete(clientId);
        if (deleteClientProfile === null) return res.status(404).json({ message: 'Client profile does not exists in the database' });
        return res.status(200).json({ message: 'Client account has been deleted!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
};