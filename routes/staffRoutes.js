const express = require('express');
const staffRouter = express.Router();
const staffController = require('../controllers/staffController');

staffRouter.post('/staff-login', staffController.staffLogin);

module.exports = staffRouter