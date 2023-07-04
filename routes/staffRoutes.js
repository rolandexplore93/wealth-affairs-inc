const express = require('express');
const { isAuthorize } = require('../helpers/jwt_helpers');
const staffRouter = express.Router();
const staffController = require('../controllers/staffController');
const faController = require('../controllers/faController');
const rmController = require('../controllers/rmController');


staffRouter.post('/staff-login', staffController.staffLogin);

// FA
staffRouter.get('/fa-portal', isAuthorize, faController.authFa);
// staffRouter.get('/fa-portal', faController.isAuthorizeStaff, faController.authFa);
staffRouter.post('/create-investment', faController.createInvestment);
staffRouter.get('/investments', faController.allInvestments);
staffRouter.get('/approved-investments', faController.approvedInvestments);
staffRouter.get('/pending-investments', faController.pendingInvestments);
staffRouter.get('/rejected-investments', faController.rejectedInvestments);
staffRouter.get('/investments/:id', faController.viewTargetInvestment);
staffRouter.patch('/investments/:id', faController.editInvestment);
// staffRouter.post('/investments/:id', faController.eachInvestment);
// staffRouter.post('/investments/:id', faController.eachInvestment);
// staffRouter.post('/investments/:id', faController.eachInvestment);

// RM
staffRouter.get('/rm-portal', isAuthorize, faController.authRm);
staffRouter.post('/decide-investment', rmController.decideInvestment);

// FC
staffRouter.get('/fc-portal', isAuthorize, faController.authFc);

module.exports = staffRouter