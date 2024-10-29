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
    const cond = name ? {name: {$regex: name, $options: 'i'}} : {};
    let query = Product.find(cond);
    let response = {status: "success"};
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.find(cond);
      const len = totalItemNum.length;
      response.totalPageNum = Math.ceil(len / PAGE_SIZE);
    }

    response.data = await query.exec();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({status: 'fail', error: error.message});
  }
};

module.exports = productController;