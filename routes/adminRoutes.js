const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const updateSchemaController = require('../controllers/updateSchemaController');
const { authorise } = require('../controllers/authorise');

adminRouter.post('/login/admin', adminController.loginAdmin);
adminRouter.post('/auth/register-staff', authorise, adminController.createUser);
adminRouter.get('/auth/staff', authorise, adminController.getUsers);
adminRouter.get('/auth/staff/:id', authorise, adminController.getUser);
adminRouter.patch('/auth/staff/:id/edit', authorise, adminController.editUser);
adminRouter.delete('/auth/staff/:id', authorise, adminController.deleteUser);
adminRouter.get('/auth/clients', authorise, adminController.getClients);
adminRouter.get('/auth/clients/:id', authorise, adminController.getClient);
adminRouter.patch('/auth/clients/:id/edit', authorise, adminController.editClient);
adminRouter.delete('/auth/clients/:id', authorise, adminController.deleteClient);

module.exports = adminRouter;