const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const {OAuth2Client} = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const authController = {};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// 이메일 로그인
authController.loginWithEmail = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if (user) {
      const userPassword = user.password;
      const isMatch = await bcrypt.compare(password, userPassword);
      if (isMatch) {
        // token 만들기
        const token = await user.generateToken();
        console.log('로그인 유저 이름 ===>', user.name);

        return res.status(200).json({status: 'success', user, token});
      }
    }
    throw new Error('다시 입력해주세요.');
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

authController.loginWithGoogle = async (req, res) => {
  try {
    const {token} = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    const {email, name} = ticket.getPayload();
    let user = await User.findOne({email});
    if (!user) {
      const randomPassword = "" + Math.floor(Math.random() * 10000000);
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);
      user = new User({
        name,
        email,
        password: newPassword,
      });
      await user.save();
    }

    const sessionToken = await user.generateToken();
    res.status(200).json({status: 'success', user, token: sessionToken});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
}

// 토큰 유효성 검증
authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) {
      throw new Error('Token not found');
    }

    const token = tokenString.replace("Bearer ", "");

    // jwt 동기방식 처리.
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    req.userId = payload._id;
    next();

  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

// 어드민 계정 검증
authController.checkAdminPermission = async (req, res, next) => {
  try {
    // token
    const {userId} = req;
    const user = await User.findById(userId);
    if (user.level !== 'admin') {
      throw new Error('권한접근이 없습니다.');
    }
    next();
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

module.exports = authController;