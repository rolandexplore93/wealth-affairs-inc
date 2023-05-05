const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRouter = require('./routes/adminRoutes')

require('./db'); // Establish connection to database
require('dotenv').config(); // Access environment variables

const app = express(); // Instantiate express application
const port = process.env.PORT || 3000;

// Set up middleware and cors
app.use(bodyParser.json());
app.use(cors());

// Set up routes
app.use('/', adminRouter)

app.get('/', (req, res) => {
    console.log("Working!!!");
    res.send('Welcome to Wealth Affairs');
})

// Server setup
app.listen(port, console.log(`Listening to the server at port: ${port}`))
