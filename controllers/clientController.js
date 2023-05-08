const { default: mongoose } = require('mongoose');
const validate =  require('validator');
const bcrypt = require('bcrypt');
const clients = require('../models/client');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Access environment variables

// Register a client
exports.signUp = async (req, res) => {
    // console.log(req.body);
    const { firstname, middlename, lastname, email, password, confirmPassword} = req.body;
    // Check if email input is valid
    if (!validate.isEmail(email)) return res.status(404).json({ message: 'Please enter a valid email address' });

    // Check if client email already exists in the db
    const existingClientInfo = await clients.findOne({ email });
    if (existingClientInfo){
        if (existingClientInfo.email === email){
            res.status(409).json({ errorMessage: 'Email already exists.' });
            return;
        }
    }

    // Check and secure client password
    if (password.length < 8 || password.length > 15) return res.status(404).json({ message: 'Password length must be between 8-15.' });
    if (!(password.toLowerCase() == confirmPassword.toLowerCase())) return res.status(404).json({ message: 'Password do not match.' });
    const salt = await bcrypt.genSalt();
    const encryptClientPassword = await bcrypt.hash(password, salt);

    const registerClientInfo = { firstname, middlename, lastname, email, password: encryptClientPassword };

    // res.status(200).json({ message: 'valid', encryptClientPassword })
    // Insert client into database
    try {
        const registeredClient = await new clients(registerClientInfo)
        await registeredClient.save();
        return res.status(200).json({
            message: 'Account created successfully.',
            registeredClient
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const clientInfo = await clients.findOne({ email })
        if (!clientInfo) return res.status(404).json({ message: 'Invalid email or password.' });

        // Compare input password with the client password stored in the database
        const comparePassword = await bcrypt.compare(password, clientInfo.password);
        if (!comparePassword) return res.status(404).json({ message: 'Invalid login details'});

        // Generate tokens for the user after login
        const token = jwt.sign({ id: clientInfo._id}, process.env.SECRETJWT, {
            expiresIn: '60 secs'
        });
        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}
