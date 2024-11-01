const Product = require("../models/Product");
const PAGE_SIZE = 5;

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status
    } = req.body;

    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status
    });

    await product.save();
    res.status(200).json({status: 'success', product});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

productController.getProducts = async (req, res) => {
  try {
    const {page, name} = req.query;
    const cond = {isDeleted: false, ...(name ? {name: {$regex: name, $options: 'i'}} : {})};
    // const cond = name ? {name: {$regex: name, $options: 'i'}} : {};
    let query = Product.find(cond);
    let response = {status: "success"};

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.find(cond).countDocuments();
      response.totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    }

    response.data = await query.exec();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("상품이 존재하지 않습니다.");
    }
    res.status(200).json({status: 'success', data: product});
  } catch (error) {
    return res.status(400).json({status: "fail", error: error.message});
  }
}

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params;
    const {
      sku,
      name,
      size,
      image,
      price,
      description,
      category,
      stock,
      status,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      {_id: productId.id},
      {sku, name, size, image, price, description, category, stock, status},
      {new: true}
    );

    if (!product) {
      throw new Error('상품이 존재하지 않습니다.');
    }

    res.status(200).json({status: 'success', data: product});
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params;
    const product = await Product.findByIdAndUpdate(
      {_id: productId.id},
      {isDeleted: true},
    );

    if (!product) {
      throw new Error('상품이 없습니다.');
    }
    res.status(200).json({status: 'success', data: product});
  } catch (error) {
    return res.status(400).json({status: "fail", error: error.message});
  }
};

productController.checkStock = async (item) => {
  const product = await Product.findById(item.productId);
  if (product.stock[item.size] < item.qty) {
    return {isVerify: false, message: `${product.name}의 ${item.size}재고가 부족합니다.`};
  }

  const newStock = {...product.stock};
  newStock[item.size] -= item.qty;
  product.stock = newStock;

  await product.save();
  return {isVerify: true};
};

productController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = [];

  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item);
      if (!stockCheck.isVerify) {
        insufficientStockItems.push({item, message: stockCheck.message});
      }
      return stockCheck;
    })
  );

  return insufficientStockItems;
};

module.exports = productController;