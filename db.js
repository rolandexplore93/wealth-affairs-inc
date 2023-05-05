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
})