const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRouter = require('./routes/adminRoutes');
const clientRouter = require('./routes/clientRoutes');
const staffRouter = require('./routes/staffRoutes');
const morgan = require('morgan');
const createError = require('http-errors');

require('./helpers/dbconnection'); // Establish connection to database
require('dotenv').config(); // Access environment variables
// const { swaggerSpecs, swaggerUi } = require('./swagger'); // Import swagger.js module
const swagger = require('./swagger');

const app = express(); // Instantiate express application
const port = process.env.PORT || 3000;

// Set up middleware and cors
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(swagger); // Mount swagger middleware

app.get('/', (req, res, next) => {
    // res.send('Welcome to Wealth Affairs');
    res.json({ message: 'Welcome to Wealth Affairs' })
});

// Set up routes
app.use('/', adminRouter);
app.use('/', clientRouter);
app.use('/', staffRouter);

app.use(async(req, res, next) => {
    next(createError.NotFound('This page does not exist'))
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
            success: false
        }
    })
});

// Server setup
app.listen(port, console.log(`Listening to the server at port: ${port}`));