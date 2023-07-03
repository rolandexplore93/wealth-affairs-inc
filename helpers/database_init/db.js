const mongoose = require('mongoose');
require('dotenv').config();
// Establish a connection to the database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.error(err.message + ": unable to connect to database");
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message)
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected')
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});