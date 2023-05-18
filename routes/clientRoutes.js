const express = require('express');
const clientRouter = express.Router();
const clientController = require('../controllers/clientController');

clientRouter.post('/register', clientController.signUp);
// clientRouter.post('/validate-email', clientController.signUp);
clientRouter.post('/login', clientController.login);
clientRouter.post('/forgot-password', clientController.forgotPassword);
clientRouter.get('/reset-password/:token', clientController.resetPasswordValidateToken);
clientRouter.post('/reset-password/:token', clientController.resetPassword);
clientRouter.patch('/auth/edit-profile', clientController.updateProfile);
// clientRouter.post('/auth/id/setup-preferences', clientController.signUp);

// clientRouter.post('/auth/id/view-recommended-ivst', clientController.signUp);
// clientRouter.post('/auth/id/tailored-investments', clientController.signUp);
// clientRouter.post('/auth/id/investments/iv-id/invest', clientController.signUp);
// clientRouter.post('/auth/id/investments/iv-id/wishlist', clientController.signUp);
// clientRouter.post('/auth/id/my-investment', clientController.signUp);
// clientRouter.post('/auth/id/wishlist-investments', clientController.signUp);
// clientRouter.post('/auth/id/investment-id', clientController.signUp);
// clientRouter.post('/auth/sort-by-maturitydate', clientController.signUp);
// clientRouter.post('/auth/filter-by-risk', clientController.signUp);
// clientRouter.post('//auth/filter-by-industry', clientController.signUp);
// clientRouter.post('/auth/filter-by-assettypes', clientController.signUp);
// clientRouter.post('/auth/filter-by-country', clientController.signUp);
// clientRouter.post('/auth/filter-by-region', clientController.signUp);
// clientRouter.post('/auth/sort-by-expirydate', clientController.signUp);
// clientRouter.post('/auth/id/past-investments', clientController.signUp);

// clientRouter.post('/auth/id/deposit', clientController.signUp);
// clientRouter.post('/auth/id/withdraw', clientController.signUp);
// clientRouter.post('/auth/id/transactions', clientController.signUp);
// clientRouter.post('/auth/id/transactions/tr-id', clientController.signUp);
// clientRouter.post('/auth/id/transactions/tr-id-share', clientController.signUp);
// clientRouter.post('/auth/id/balance', clientController.signUp);
// clientRouter.post('/auth/id/validate-phoneno', clientController.signUp);
// clientRouter.post('/auth/id/validate-id', clientController.signUp);

module.exports = clientRouter;