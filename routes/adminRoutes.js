const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const updateSchemaController = require('../controllers/updateSchemaController');
const { authorise } = require('../controllers/authorise');

adminRouter.post('/loginAdmin', adminController.loginAdmin);
adminRouter.post('/logoutAdmin', authorise, adminController.logoutAdmin);
adminRouter.post('/auth/register-staff', authorise, adminController.createStaffUser);
adminRouter.get('/auth/staff', authorise, adminController.getAllStaff);
adminRouter.get('/auth/staff/:id', authorise, adminController.getStaffById);
adminRouter.patch('/auth/staff/:id', authorise, adminController.editStaff);
adminRouter.delete('/auth/staff/:id', authorise, adminController.deleteStaff);
adminRouter.get('/auth/clients', authorise, adminController.getClients);
adminRouter.get('/auth/clients/:id', authorise, adminController.getClientById);
adminRouter.patch('/auth/clients/:id', authorise, adminController.editClient);
adminRouter.delete('/auth/clients/:id', authorise, adminController.deleteClient);

module.exports = adminRouter;


// tokens: [{type: object}]
// let oldTokens = user.tokens || []