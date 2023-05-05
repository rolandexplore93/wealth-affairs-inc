const configAdmin = require('../configadmin');
const Fa = require('../models/fas');
const Fc = require('../models/fcs');
const Rm = require('../models/rms');

// Admin login
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === configAdmin.username && password === configAdmin.password){
            res.status(200).json({ message: 'Login successful...' })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' })
    }
}

// Create user
exports.createUser = async (req, res) => {
    
}

// View all users
exports.getUsers =  async (req, res) => {

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