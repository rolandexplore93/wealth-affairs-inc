const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const StaffSchema = new Schema({
    firstname: { type: String, required: true},
    middlename: { type: String },
    lastname: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNo: { type: String, required: true, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['Fund Administrator', 'Fund Controller', 'Relationship Manager']
    },
    creator: { type: String, default: 'Admin'}
}, { timestamps: true});

StaffSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(this.password, salt);
        this.password = encryptPassword;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Staff', StaffSchema);