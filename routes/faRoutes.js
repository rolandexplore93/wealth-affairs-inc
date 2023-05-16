const express = require('express');
const faRouter = express.Router();
const faController = require('../controllers/faController');

faRouter.get('/fa-portal', faController.authoriseStaff, faController.authFa);
faRouter.post('/create-investment', faController.createInvestment);
faRouter.get('/investments', faController.allInvestments);
faRouter.get('/approved-investments', faController.approvedInvestments);
faRouter.get('/pending-investments', faController.pendingInvestments);
faRouter.get('/rejected-investments', faController.rejectedInvestments);
// faRouter.post('/investments/:id', faController.eachInvestment);
// faRouter.get('/fc-portal', faController.authoriseStaff, faController.authFc);
// faRouter.get('/rm-portal', faController.authoriseStaff, faController.authRm);

module.exports = faRouter;