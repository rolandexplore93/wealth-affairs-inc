const mongoose = require('mongoose');
const { Schema } = mongoose;

const rmsSchema = new Schema({
    lastname: { type: String, required: true},
    othernames: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    role: {
        type: String,
        enum: ['FA', 'FC', 'RM']
    },
    phoneNo: { type: String, required: true },
})

module.exports = mongoose.model('Rm', rmsSchema);