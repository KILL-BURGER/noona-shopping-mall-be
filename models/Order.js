const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Product = require('./Product');
const Cart = require("./Cart");

const orderSchema = new Schema({
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    shipTo: {
      type: Object,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
        },
        size: {
          type: String,
          required: true,
        }
      }
    ],
    orderNum: {
      type: String,
    },
    status: {
      type: String,
      default: "preparing",
    },
  }, {timestamps: true}
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

orderSchema.post('save', async function () {
  const cart = await Cart.findOne({userId: this.userId});
  cart.items = [];
  await cart.save();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;