const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    default: "customer"
  },


}, {timestamps: true});

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

userSchema.methods.generateToken = async function () {
  return await jwt.sign(
    {_id: this._id},              // this로 스키마의 _id 접근
    JWT_SECRET_KEY,               // JWT 시크릿 키는 변수로 사용
    {expiresIn: "1d"}             // 토큰 만료 시간 설정
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;