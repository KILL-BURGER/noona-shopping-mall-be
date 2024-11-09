const express = require('express');
const router = express();
const authController = require('../controller/auth.controller');
const wishListController = require('../controller/wishList.controller');

// 위시리스트 조회
router.get('/', authController.authenticate, wishListController.getWishList);

// 위시리스트 추가
router.post('/', authController.authenticate, wishListController.addWishList);

// 위시리스트 삭제
router.delete('/:id', authController.authenticate, wishListController.deleteWishProduct);

module.exports = router;