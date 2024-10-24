const User = require('../models/User');
const userController = {};
const bcrypt = require('bcryptjs');

userController.createUser = async (req, res) => {
  try {
    const {email, password, name, level} = req.body;
    const user = await User.findOne({email: email});

    // 회원 중복 검증
    if (user) {
      throw new Error('이미 가입된 회원입니다.');
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSaltSync(10);
    const encodePassword = await bcrypt.hash(password, salt);

    // 유저 회원가입
    const newUser = new User({
        email: email,
        password: encodePassword,
        name: name,
        level: level ? level : 'customer'
      }
    );
    await newUser.save();

    return res.status(200).json({status: 'success', message: '회원가입이 완료되었습니다.'});

  } catch (error) {
    res.status(400).json({status: "fail", error: error.message});
  }
};

module.exports = userController;