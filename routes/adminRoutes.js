const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const updateSchemaController = require('../controllers/updateSchemaController');
const { isAuthorize } = require('../helpers/jwt_helpers');

adminRouter.post('/grant-admin-access', adminController.grantLoginAccessToAdmin);
adminRouter.post('/loginAdmin', adminController.loginAdmin);
adminRouter.post('/refresh-tokens', adminController.refreshAccessToken);
adminRouter.post('/logoutAdmin', isAuthorize, adminController.logoutAdmin);
adminRouter.post('/auth/register-staff', isAuthorize, adminController.createStaffUser);
adminRouter.get('/auth/staff', isAuthorize, adminController.getAllStaff);
adminRouter.get('/auth/staff/:id', isAuthorize, adminController.getStaffById);
adminRouter.patch('/auth/staff/:id', isAuthorize, adminController.editStaff);
adminRouter.delete('/auth/staff/:id', isAuthorize, adminController.deleteStaff);
adminRouter.get('/auth/clients', isAuthorize, adminController.getClients);
adminRouter.get('/auth/clients/:id', isAuthorize, adminController.getClientById);
adminRouter.patch('/auth/clients/:id', isAuthorize, adminController.editClient);
adminRouter.delete('/auth/clients/:id', isAuthorize, adminController.deleteClient);

module.exports = adminRouter;

// tokens: [{type: object}]
// let oldTokens = user.tokens || []