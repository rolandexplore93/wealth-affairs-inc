const { default: mongoose } = require('mongoose');
const validate =  require('validator');
const bcrypt = require('bcrypt');
const clients = require('../models/client');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Access environment variables

// client signup
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
};

// Client signin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.headers.host) // The host address (localhost:3000)
        const clientInfo = await clients.findOne({ email })
        if (!clientInfo) return res.status(404).json({ message: 'Invalid email or password.' });

        // Compare input password with the client password stored in the database
        const comparePassword = await bcrypt.compare(password, clientInfo.password);
        if (!comparePassword) return res.status(404).json({ message: 'Invalid login details'});

        // Generate tokens for the user after login
        // const token = jwt.sign({ id: clientInfo._id}, process.env.SECRETJWT, {
        //     expiresIn: '60 secs'
        // });
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
};

exports.forgotPassword = async (req, res) => {
    
    try {
        const { email } = req.body;
        // Check if email input is valid
        if (!validate.isEmail(email)) return res.status(404).json({ message: 'Please enter a valid email address' });
        const getClient = await clients.findOne({ email });
        if (!getClient) return res.status(404).json({ message: 'Email does not exists.' })

        // Email is valid, then generate a reset token with jwt and save it to the database
        const token = await jwt.sign({ _id: getClient._id }, process.env.SECRETJWT, { expiresIn: '60s'});
        getClient.resetToken = token;
        getClient.resetTokenExpiration = new Date().getTime() + 120000 // Expires in 60 seconds
        await getClient.save();

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
        return res.status(200).json({ message: `Your password reset link has been generated. Click ${resetUrl} to set a new password`})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

exports.resetPasswordValidateToken = async (req, res) => {
    try {
        // Find the user with the same token if the token has not expired
        const client = await clients.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: { $gt: new Date().getTime() }
        });
        
        // Token has expired. Note: Implement from frontend to redirect user to forgot-password request page
        if (!client) return res.status(400).json({ message: 'Password reset token has expired. Please, request forgot password again.' });
        
        // Token is valid. Note: Then implement from frontend to load reset-password form for user to submit new password
        // res.render('/reset-password/', { token: req.params.token})  // direct to form page
        return res.status(200).json({message: `Token is valid for ${client.email}. You can now set new password`})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body;
        const client = await clients.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: { $gt: new Date().getTime() }
        });
        if (!client) return res.status(400).json({ message: 'Password reset token has expired. Please, request forgot password again.' })

        // Check and secure client password
        if (newPassword.length < 8 || newPassword.length > 15) return res.status(404).json({ message: 'Password length must be between 8-15.' });
        if (!(newPassword.toLowerCase() == confirmNewPassword.toLowerCase())) return res.status(404).json({ message: 'Password do not match.' });
        const salt = await bcrypt.genSalt();
        const encryptClientPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the client password field and set resetToken & resetTokenExpiration to undefined 
        client.password = encryptClientPassword;
        client.resetToken = undefined;
        client.resetTokenExpiration = undefined;
        await client.save()
        
        return res.status(200).json({ message: 'Your password has been updated successfully' })        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errorMessage: `Internal Server Error: ${error.message}` });
    }
};


exports.updateProfile = async (req, res) => {
    // Get client id from session storage when client is authorised to their page
    const { _id, firstname, middlename, lastname, email, phoneNo, country } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ message: 'Investment ID is invalid' });
        await clients.findByIdAndUpdate(_id, {firstname, middlename, lastname, email, phoneNo, country}, { new: true });
        return res.status(200).json({ message: 'Profile updated.' });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}