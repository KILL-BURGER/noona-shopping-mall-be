const express = require('express');
const router = express();
const authController = require('../controller/auth.controller');
const orderController = require('../controller/order.controller');

router.post('/', authController.authenticate, orderController.createOrder);
router.get('/me', authController.authenticate, orderController.getOrder);

router.get('/', authController.authenticate, orderController.getOrderList);

router.put('/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.updateOrder);

module.exports = router;