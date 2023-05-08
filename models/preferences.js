const mongoose = require('mongoose');
const { Schema } = mongoose;

const subProductTypesSchema = new Schema({
    subProductTypes: [{ type: String }]
});

const productTypesSchema = new Schema({
    priProductTypes: [{type: String}],
    secProductTypes: [subProductTypesSchema]
});

const subIndustriesSchema = new Schema({
    subIndustries: [{ type: String }]
});

const industriesSchema = new Schema({
    priIndustries: [{type: String}],
    secIndustries: [subIndustriesSchema]
});

const countriesSchema = new Schema({
    countries: [{type: String}],
});

const regionsSchema = new Schema({
    regions: [{type: String}],
});

module.exports = {
    ProductType: mongoose.model('ProductType', productTypesSchema),
    Industry: mongoose.model('Industry', industriesSchema),
    Country: mongoose.model('Country', countriesSchema),
    Region: mongoose.model('Region', regionsSchema)
};