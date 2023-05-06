const configAdmin = require('../configadmin');
const staff = require('../models/staff');
// const Fa = require('../models/fas');
// const Fc = require('../models/fcs');
// const Rm = require('../models/rms');
let crypto;
crypto = require('node:crypto');
// try {
// //   console.log(crypto)
// } catch (err) {
//   console.error('crypto support is disabled!');
// }

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
    if (role === 'FA') { role = 'Fund Administrator'}
    else if (role === 'FC') { role = 'Fund Controller'}
    else if (role === 'RM') { role = 'Relationship Manager'}
    else { role = 'Role Not Assigned'}

    const generatePassword = () => {
        const passwordLength = 10;
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
    
    try {
        const staffPassword = await generatePassword()
        let generateEmail = `${firstname.toLowerCase().slice(0,1)}${middlename.toLowerCase().slice(0,1)}${lastname.toLowerCase().slice(0,1)}${phoneno.toLowerCase().slice(-3)}${companydomainmail}`;
        // console.log(generateEmail);
        res.status(200).json({
            message: 'Staff created successfully.',
            generateEmail, pw: staffPassword, role
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errorMessage: 'Server Error. Please try again' })
    }

}

// View all users
exports.getUsers =  async (req, res) => {
    try {
        const staffList = await staff.find();
        if (staffList.length === 0) res.status(200).json({ message: 'No staff found!'})
        else {
            console.log(staffList.length)
            res.status(200).json({ message: 'Staff list displayed below', staffList })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errorMessage: 'Server Error. Please try again' })
    }

}

// View each user (id)
exports.getUser =  async (req, res) => {

}

// Modify user details (id)
exports.editUser =  async (req, res) => {

}

// View delete user (id)
exports.deleteUser =  async (req, res) => {

}

// View all clients
exports.getClients =  async (req, res) => {

}

// View each client
exports.getClient =  async (req, res) => {

}

// Modify client details (id)
exports.editClient =  async (req, res) => {

}

// Delete client
exports.deleteClient =  async (req, res) => {

}