const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const updateSchemaController = require('../controllers/updateSchemaController');

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