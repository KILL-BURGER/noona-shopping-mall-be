const WishList = require('../models/WishList');
const productController = require('./product.controller');
const wishListController = {};

wishListController.addWishList = async (req, res) => {
  try {
    const {userId} = req;
    const {productId} = req.body;

    // 추가할 상품 조회
    const wishProduct = await productController.getProductByProductId(productId);
    if (!wishProduct) {
      throw new Error('존재하지 않는 상품입니다.');
    }

    // 기존 위시리스트 조회 또는 생성
    let target = await WishList.findOne({userId});
    if (target === null) {
      // 위시리스트가 없으면 새로 생성
      target = new WishList({
        userId,
        items: [wishProduct],
      });
      await target.save();
    } else {
      // 상품 중복검사
      const isAlreadyInWishlist = target.items.some(item => item._id.equals(wishProduct._id));
      if (isAlreadyInWishlist) {
        return res.status(400).json({status: 'fail', error: '이미 관심상품에 등록된 상품입니다.'});
      }
      // 중복이 없으면 상품 추가
      target.items.push(wishProduct);
      await target.save();
    }

    res.status(200).json({status: 'success', message: '관심상품에 등록되었습니다.', data: target.items.length});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

wishListController.getWishList = async (req, res) => {
  try {
    const {userId} = req;
    const findWishList = await WishList.findOne({userId});

    // 관심상품이 없는 경우
    if (!findWishList) {
      res.status(200).json({status: 'success', data: []});
    } else {
      res.status(200).json({status: 'success', data: findWishList.items});
    }
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

wishListController.deleteWishProduct = async (req, res) => {
  try {
    const {userId} = req;
    const {id} = req.params;
    const target = await WishList.findOne({userId});
    target.items = target.items.filter(item => !item._id.equals(id));

    await target.save();

    res.status(200).json({status: 'success', message: '삭제완료'});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};


module.exports = wishListController;