const mongoose = require('mongoose');
const { Schema } = mongoose;

const investmentSchema = new Schema({
    investmentDisplayName: { type: String, required: true },
    investmentName: { type: String, required: true },
    primaryAssetType: { type: String, required: true },
    secondaryAssetType: { type: String, default: '' },
    industry: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    issuer: { type: String, required: true },
    stockExchange: { type: String, required: true },
    currency: { type: String, required: true },
    unit: { type: Number, required: true },
    closingPrice: { type: Number, required: true },
    priceClosingDate: { type: Date, required: true },
    maturityDate: { type: Date, required: true },
    coupon: [{ type: String }],
    riskLevel: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    riskLevelBrief: { type: String },
    riskLevelDescription: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    createdByStaff: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    decidedByStaff: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
}, { timestamps: true });

const investmentModel = mongoose.model('investment', investmentSchema);
module.exports = investmentModel;