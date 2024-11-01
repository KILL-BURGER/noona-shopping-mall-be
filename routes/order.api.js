const express = require('express');
const router = express();
const authController = require('../controller/auth.controller');
const orderController = require('../controller/order.controller');

router.post('/', authController.authenticate, orderController.createOrder);

module.exports = router;