const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database');
    app.listen(port, console.log(`Listening to the server on port: ${port}`));
}).catch(err => {
    console.error(err.message + ": unable to connect to database");
})