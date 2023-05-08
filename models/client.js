const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    firstname: { type: String, required: true},
    middlename: { type: String, default: '' },
    lastname: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNo: { type: String, default: '' },
    country: { type: String, default: '' },
    relationshipManager: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    isRMAssigned: { type: Boolean, default: false },
    isPreferencesSet: { type: Boolean, default: false },
    investmentPreferences: {
        riskLevel: { 
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: null
         },
        productTypes: [{ type: Schema.Types.ObjectId, ref: 'ProductType' }],
        industries: [{ type: Schema.Types.ObjectId, ref: 'Industry' }],
        countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
        regions: [{ type: Schema.Types.ObjectId, ref: 'Region' }],
    }
}, { timestamps: true})

module.exports = mongoose.model('Client', clientSchema)





// address: { type: String },
// postcode: { type: String },
// city: { type: String },
// state: { type: String },
// enum: ['United Kingdom', 'United States', 'Nigeria', 'Canada', 'Germany', 'India']