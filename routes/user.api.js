const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authController = require("../controller/auth.controller");

// 회원가입
router.post('/', userController.createUser);
// 토큰 로그인 - 토큰이 유효한것인지, token -> 유저 찾기
router.get('/me', authController.authenticate, userController.getUser);

module.exports = router;