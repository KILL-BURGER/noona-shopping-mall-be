const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const cartController = require('../controller/cart.controller');

router.post('/', authController.authenticate, cartController.addItemToCart);

module.exports = router;