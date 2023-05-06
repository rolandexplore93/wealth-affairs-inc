const mongoose = require('mongoose');
const { Schema } = mongoose;

const staffSchema = new Schema({
    firstname: { type: String, required: true},
    middlename: { type: String },
    lastname: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNo: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['Fund Administrator', 'Fund Controller', 'Relationship Manager']
    },
    creator: { type: String, default: 'Admin'}
}, { timestamps: true});

module.exports = mongoose.model('Staff', staffSchema);