const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addProductCart = (req, res) => {
  const productId = req.body.id;
  if(productId) {
    res.status(200).json({message: 'ok'})
    console.log('productId--', productId);
    Product.findById(productId);
  }else {
    res.status(404).json({message: 'failure'})
  }
}