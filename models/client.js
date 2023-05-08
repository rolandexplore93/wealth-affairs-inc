const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    firstname: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNo: { type: String, unique: true },
    country: { type: String },
    relationshipManager: { type: Schema.Types.ObjectId, ref: 'Staff' },
    isAssignedRM: { type: Boolean, default: false },
    isPreferencesSet: { type: Boolean, default: false },
    investmentPreferences: {
        riskLevel: { 
            type: Number,
            enum: [1, 2, 3, 4, 5]
         },
        productTypes: [{ type: Schema.Types.ObjectId, ref: 'ProductType' }],
        industries: [{ type: Schema.Types.ObjectId, ref: 'Industry' }],
        countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
        regions: [{ type: Schema.Types.ObjectId, ref: 'Region' }],
    }
}, { timestamps: true})

module.exports = mongoose.model('Client', clientSchema)





// middlename: { type: String },
// lastname: { type: String, required: true},
// address: { type: String },
// postcode: { type: String },
// city: { type: String },
// state: { type: String },
// enum: ['United Kingdom', 'United States', 'Nigeria', 'Canada', 'Germany', 'India']