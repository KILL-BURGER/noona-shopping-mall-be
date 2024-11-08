const Order = require('../models/Order');
const productController = require("./product.controller");
const randomStringGenerator = require("../utils/randomStringGenerator");
const orderController = {};

const PAGE_SIZE = 3;
// orderController.createOrder = async (req, res) => {
//   try {
//     const {userId} = req;
//     const {shipTo, contact, totalPrice, orderList} = req.body;
//
//     const insufficientStockItems = await productController.checkItemListStock(orderList);
//     console.log('ins ==>', insufficientStockItems);
//     if (insufficientStockItems.length > 0) {
//       const errorMessage = insufficientStockItems
//         .reduce((total, item) => total += item.message, "");
//       throw new Error(errorMessage);
//     }
//
//     const newOrder = new Order({
//       userId,
//       totalPrice,
//       shipTo,
//       contact,
//       items: orderList,
//       orderNum: randomStringGenerator(),
//     });
//
//     await newOrder.save();
//
//     res.status(200).json({status: 'success', orderNum: newOrder.orderNum});
//   } catch (error) {
//     res.status(400).json({status: 'fail', error: error.message});
//   }
// };
orderController.createOrder = async (req, res) => {
  try {
    const {userId} = req;
    const {shipTo, contact, totalPrice, orderList} = req.body;

    const insufficientStockItems = await productController.checkItemListStock(orderList);

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce((total, item) => total + item.message, "");
      return res.status(400).json({status: 'fail', error: errorMessage});
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    res.status(200).json({status: 'success', orderNum: newOrder.orderNum});
  } catch (error) {
    console.error("Order creation error: ", error);
    res.status(400).json({status: 'fail', error: '주문 처리 중 오류가 발생했습니다.'});
  }
};


orderController.getOrder = async (req, res) => {
  try {
    const {userId} = req;

    const orderList = await Order.find({userId}).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
        select: 'image name',
      }
    });
    const totalItemNum = await Order.find({userId: userId}).countDocuments();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({status: 'success', data: orderList, totalPageNum});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};
orderController.getOrderList = async (req, res) => {
  try {
    const {page, ordernum} = req.query;

    const cond = ordernum ? {orderNum: {$regex: ordernum, $options: 'i'}} : {};

    const orderList = await Order.find(cond)
      .populate('userId')
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product',
          select: 'image name'
        },
      })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    const totalItemNum = await Order.find(cond).countDocuments();
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

    res.status(200).json({status: 'success', data: orderList, totalPageNum: totalPageNum});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      {status: status},
      {new: true}
    );
    if (!order) {
      throw new Error("주문을 찾을 수 없습니다.");
    }

    res.status(200).json({status: "success", data: order});
  } catch (error) {
    return res.status(400).json({status: "fail", error: error.message});
  }
};

module.exports = orderController;