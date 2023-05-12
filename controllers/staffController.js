// const { default: mongoose } = require('mongoose');
const validate =  require('validator');
const staff = require('../models/staff');
const bcrypt = require('bcrypt');

exports.staffLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!validate.isEmail(email)) return res.status(404).json({ message: 'Please enter a valid email address' });
        const staffList = await staff.findOne({ email });
        if (!staffList) return res.status(400).json({ message: 'User email does not exist.' });
        const staffPassword = await bcrypt.compare(password, staffList.password);
        if (!staffPassword) return res.status(404).json({ message: 'Invalid login details'});

        let redirectionUrl;
        if (staffList.role === 'Fund Administrator'){
            redirectionUrl = `http://${req.headers.host}/fa-portal`;
        } else if (staffList.role === 'Fund Controller'){
            redirectionUrl = `http://${req.headers.host}/fc-portal`;
        } else if (staffList.role === 'Relationship Manager'){
            redirectionUrl = `http://${req.headers.host}/rm-portal`;
        } else {
            return res.status(400).json({ message: 'User role not assigned' })
        };
        
        return res.status(200).json({ message: 'Logged successful. Redirecting...', redirectionUrl })
    } catch (error) {
     console.log(error.message);
     res.status(500).json({ message: error.message});
    }
};