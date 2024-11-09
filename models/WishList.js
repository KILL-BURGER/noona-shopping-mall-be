const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./Product');
const User = require("./User");
const wishListSchema = new Schema({
    userId: {
      type: mongoose.ObjectId,
      ref: User,
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        image: {
          type: String,
        }
      }
    ],
  }, {timestamps: true}
);

wishListSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;