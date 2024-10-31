const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const authController = require('../controller/auth.controller');

router.post('/',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct,
);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.put('/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.updateProduct
);

router.delete('/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.deleteProduct
);

module.exports = router;