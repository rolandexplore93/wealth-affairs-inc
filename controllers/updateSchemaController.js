const { default: mongoose } = require('mongoose');
const clients = require('../models/client');

const updateClientsSchema = async () => {
    try {
        await clients.updateMany({}, { $set: { resetToken: undefined, resetTokenExpiration: undefined } });
        const stats = await clients.collection.stats();
        console.log(`Clients schema fields have been updated. Collection size: ${stats.size}`);
    } catch (error) {
        console.log(`Error updating Clients schema: ${error.message}`);
    }
};
// updateClientsSchema()