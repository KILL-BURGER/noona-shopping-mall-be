const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Product = require('./Product');

const cartSchema = new Schema({
    userId: {
      type: mongoose.ObjectId,
      ref: User,
    },
    items: [{
      productId: {
        type: mongoose.ObjectId,
        ref: Product
      },
      size: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        default: 1
      },
    }],

  }, {timestamps: true}
);

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.updatedAt;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;