const express = require('express');
const faRouter = express.Router();
const faController = require('../controllers/faController');

faRouter.post('/create-investment', faController.createInvestment);
faRouter.get('/fa-portal', faController.authoriseStaff, faController.authFa);
// faRouter.get('/fc-portal', faController.authoriseStaff, faController.authFc);
// faRouter.get('/rm-portal', faController.authoriseStaff, faController.authRm);

module.exports = faRouter;