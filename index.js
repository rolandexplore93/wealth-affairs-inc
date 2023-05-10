const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRouter = require('./routes/adminRoutes');
const clientRouter = require('./routes/clientRoutes');

require('./db'); // Establish connection to database
require('dotenv').config(); // Access environment variables
// const { swaggerSpecs, swaggerUi } = require('./swagger'); // Import swagger.js module
const swagger = require('./swagger');

const app = express(); // Instantiate express application
const port = process.env.PORT || 3000;

// Set up middleware and cors
app.use(bodyParser.json());
app.use(cors());
app.use(swagger); // Mount swagger middleware


// Mount swagger middleware
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/**
 * @swagger
 * /:
 *  get:
 *      summary: This the welcome page
 *      description: Welcome here
 *      responses:
 *          200:
 *              description: To test get homepage is working
 *              content:
 *                  application/json:
 * 
*/

// /**
//  * @swagger
//  * /login/admin:
//  *  post:
//  *      summary: Login admin
//  *      description: Login admin to their portal
//  *      responses:
//  *          200:
//  *              description: Login admin to their portal...
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: string
//  *                          items:
// //  *                              $ref: '#/models/'
//  * 
// */

// Set up routes
app.use('/', adminRouter)
app.use('/', clientRouter);

app.get('/', (req, res) => {
    console.log("Working!!!");
    res.send('Welcome to Wealth Affairs');
})


// Server setup
app.listen(port, console.log(`Listening to the server at port: ${port}`))
