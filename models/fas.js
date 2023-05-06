// import mongoose from "mongoose";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const fasSchema = new Schema({
    lastname: { type: String, required: true},
    fullname: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    phoneNo: { type: String, required: true },
    role: {
        type: String,
        enum: ['FA', 'FC', 'RM']
    }
});

module.exports = mongoose.model('Fa', fasSchema);