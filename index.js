const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const adminRoutes = require('./routes/admin')
const adminRoutes = require('./routes/adminRoutes');

const app = express(); // Instantiate express application
require('./db');

// Set up middleware
app.use(express.json());

// Set up routes
app.use('/auth/create-investment', adminRoutes);
