const Cart = require('../models/Cart');

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    if (existItem) {
      throw new Error('아이템이 이미 카트에 담겨있습니다.');

    }
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message || "Something went wrong" });
  }
};

module.exports = cartController;
