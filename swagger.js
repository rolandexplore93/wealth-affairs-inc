const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

// const app = express();

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Wealth Affairs Inc API',
//             version: '1.0.0',
//             description: 'Wealth Affairs API documentation'
//         },
//         servers: [
//             {
//                 url: 'http://localhost:3000',
//             },
//         ],
//     },
//     apis: ['./index.js', './routes/*.js']
// };

// const swaggerSpecs = swaggerJsdoc(options);
// module.exports = { swaggerSpecs, swaggerUi };

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wealth Affairs Inc API',
            version: '1.0.0',
            description: 'Wealth Affairs API documentation'
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js', './routes/*.js']
};

const swaggerSpecs = swaggerJsdoc(options); // Initialising swagger specs
router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
module.exports = router;