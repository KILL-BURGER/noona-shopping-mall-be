const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Product = require('./Product');

const orderSchema = new Schema({
    orderNum: {
      type: String,
    },
    shipTo: {
      type: Object,
      required: true,
    },

    contact: {
      type: Object,
      required: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },

    status: {
      type: String,
      default: "preparing",
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

  }, {timestamps: true}
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;