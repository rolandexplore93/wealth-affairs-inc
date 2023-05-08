const { default: mongoose } = require('mongoose');
const configAdmin = require('../configadmin');
const bcrypt = require('bcrypt');
const staff = require('../models/staff');
const clients = require('../models/client');
// clients
// const Fa = require('../models/fas');
// const Fc = require('../models/fcs');
// const Rm = require('../models/rms');

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
    const uname = username.toLowerCase();
    try {
        if (uname === configAdmin.username && password === configAdmin.password){
            res.status(200).json({ message: 'Login successful...' })
        } else {
            res.status(401).json({ message: 'Invalid credentials. Please, enter correct username and password' })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errorMessage: 'Server Error. Please try again' })
    }
}

// Create user
exports.createUser = async (req, res) => {
    let { firstname, middlename, lastname, phoneno, role } = req.body;
    const companydomainmail = '@wealthaffairs.com';

    // Confirm roles
    if (role === 'FA') role = 'Fund Administrator';
    else if (role === 'FC') role = 'Fund Controller';
    else if (role === 'RM') role = 'Relationship Manager';
    else return res.status(404).json({ message: 'Role Not Assigned'});


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
        const staffAddedToDb = await createStaff.save();
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

}

// View all users
exports.getUsers =  async (req, res) => {
    try {
        // const staffList = await staff.find().select('-password -role -email'); // Exclude multiple fields
        // const staffList = await staff.find({}, {password: 0, role: 0, firstname: 0}); // Exclude multiple fields
        const staffList = await staff.find().select('-password');
        if (staffList.length === 0) return res.status(200).json({ message: 'No staff found!'})
        else {
            console.log(staffList.length)
            return res.status(200).json({ message: 'Staff list displayed below', staffList })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}. Please try again...` });
    }
}

// View each user (id)
exports.getUser =  async (req, res) => {
    try {
        const staffId = req.params.id;
        // Check if the staff id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(404).json({ message: 'Invalid Staff ID'})
        const staffInfo = await staff.findById(staffId).select('-password');
        if (!staffInfo) return res.status(404).json({message: 'Staff not found!'});
        return res.status(200).json({ staffInfo });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// Modify user details (id)
exports.editUser =  async (req, res) => {
    try {
        const staffId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(404).json({ message: 'Invalid ID' })

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
exports.deleteUser =  async (req, res) => {
    try {
        const staffId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(staffId)) return res.status(404).json({ message: 'Invalid ID' });
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
    try {
        const allClients = await clients.find();
        if (allClients.length === 0) return res.status(200).json({ message: 'No registered client yet!'});
        return res.status(200).json({ message: `${allClients.length} found.`, data: `${allClients}` })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

// View each client
exports.getClient =  async (req, res) => {
    try {
        const clientId = req.params.id;
        // Check if the client id is valid before interacting with the database
        if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(404).json({ message: 'Invalid Client ID'});
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

}

// Delete client
exports.deleteClient =  async (req, res) => {

}