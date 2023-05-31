const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const adminRoutesDocs = require('./routes/admin.swaggerdocs');
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
            title: 'Wealth Affairs Inc. API',
            description: `This is the API documentation for Wealth Affairse.
            \nThe links blow contains useful links about this project: 
            \n[Wealth Affairs Repository](https://github.com/rolandexplore93/wealth-affairs-inc)
            \n[The source API definition for Wealth Affairs Inc](https://github.com/rolandexplore93/wealth-affairs-inc/blob/main/swagger.js)
            `,
            contact: { email: 'roland2rule@gmail.com' },
            version: '1.0.0',
        },
        servers: [
            // { url: 'http://localhost:3000' }, // testing
            { url: 'https://wealth-affairs.onrender.com' } // production
        ],
        tags: [
            {
                name: 'Admin',
                description: 'Operations about admin user',
                externalDocs: {
                    description: 'Admin routes docs',
                    url: 'https://github.com/rolandexplore93/wealth-affairs-inc/blob/main/routes/admin.swaggerdocs.js'
                }
            },
            {
                name: 'Fund Administrator',
                description: 'Operations about Fund Admin user'
            },
            {
                name: 'Relationship Manager',
                description: 'Operations about the relationship manager user'
            },
            {
                name: 'FC',
                description: 'Operations about the FC user'
            },
            {
                name: 'Clients',
                description: 'Operations about clients'
            }
        ],
        paths: {...adminRoutesDocs},
        components: {...adminRoutesDocs},
        security: {...adminRoutesDocs}
    },
    apis: ['./index.js', './routes/*.js']
};

const swaggerSpecs = swaggerJsdoc(options); // Initialising swagger specs
router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
module.exports = router;