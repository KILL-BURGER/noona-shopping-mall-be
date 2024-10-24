const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

// 유저 로그인
router.post('/login', authController.loginWithEmail);

module.exports = router;