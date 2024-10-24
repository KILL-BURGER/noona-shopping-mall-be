const User = require("../models/User");
const bcrypt = require('bcryptjs');
const authController = {};

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
        console.log('로그인 유저 ===>', user.name);
        return res.status(200).json({status: 'success', user, token});
      }
    }
    throw new Error('다시 입력해주세요.');
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

module.exports = authController;