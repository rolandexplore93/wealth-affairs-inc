const express = require('express');
const faRouter = express.Router();
const faController = require('../controllers/faController');
const authorisePage = require('../controllers/authorise')

faRouter.get('/fa-portal', authorisePage.authorise, faController.authFa);
// faRouter.get('/fa-portal', faController.authoriseStaff, faController.authFa);
faRouter.post('/create-investment', faController.createInvestment);
faRouter.get('/investments', faController.allInvestments);
faRouter.get('/approved-investments', faController.approvedInvestments);
faRouter.get('/pending-investments', faController.pendingInvestments);
faRouter.get('/rejected-investments', faController.rejectedInvestments);
faRouter.get('/investments/:id', faController.viewTargetInvestment);
faRouter.patch('/investments/:id', faController.editInvestment);
// faRouter.post('/investments/:id', faController.eachInvestment);
// faRouter.post('/investments/:id', faController.eachInvestment);
// faRouter.post('/investments/:id', faController.eachInvestment);
faRouter.get('/fc-portal', authorisePage.authorise, faController.authFc);
faRouter.get('/rm-portal', authorisePage.authorise, faController.authRm);

module.exports = faRouter;