const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const updateSchemaController = require('../controllers/updateSchemaController');

/**
 * @swagger
 * /api/auth/clients:
 *  get:
 *      summary: Get a list of all clients
 *      description: Return a list of all clients
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of clients
 *              schema:
 *                  $ref: '#/definitions/clientSchema'
 *          401:
 *              description: Unauthorised
 *          500:
 *              description: Internal server error
 * 
 * 
 * definitions:
 *   clientSchema:
 *     $ref: 'file://./models/client'
 */


adminRouter.post('/login/admin', adminController.loginAdmin);
adminRouter.post('/auth/register-staff', adminController.createUser);
adminRouter.get('/auth/staff', adminController.getUsers);
adminRouter.get('/auth/staff/:id', adminController.getUser);
adminRouter.patch('/auth/staff/:id/edit', adminController.editUser);
adminRouter.delete('/auth/staff/:id', adminController.deleteUser);
adminRouter.get('/auth/clients', adminController.getClients);
adminRouter.get('/auth/clients/:id', adminController.getClient);
adminRouter.patch('/auth/clients/:id/edit', adminController.editClient);
adminRouter.delete('/auth/clients/:id', adminController.deleteClient);

module.exports = adminRouter;


// /**
//  * @swagger
//  * /api/users:
//  *   get:
//  *     summary: Get a list of users
//  *     description: Returns a list of users
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: An array of users
//  *         schema:
//  *           $ref: '#/definitions/User'
//  *       401:
//  *         description: Unauthorized
//  */
// router.get('/users', (req, res) => {
//     // ...
//   });