const ProductModel = require('../models/product');
const { validationResult } = require('express-validator');

class ProductController {

  getProducts(req, res) {
    ProductModel.find()
      //.select('title price - _id') //only get title and price omit _id
      //.populate('userId') //reference to user by userId into product model
      .then((result) => {
        // console.log('get-product', result)
        res.status(200).json({
          products: result,
          message: 'ok'
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          message: 'Get All products failure!'
        })
      });
  };

  getDetailProduct(req, res) {
    const productId = req.params.id;
    // console.log('id-edit', productId)
    ProductModel.findById(productId)
      .then(product => {
        res.status(200).json({
          product: product,
          message: 'ok'
        })
      })
      .catch(err => {
        res.status(400).json({ message: err })
      });
  }

  postAddProduct(req, res) {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const error = validationResult(req);
    if(!error.isEmpty()) {
      return res.status(422).json({message : error.array()[0]});
    }
    const product = new ProductModel({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.user._id
    })
    product.save()
    .then(result => {
      res.status(200).json({
        message: 'ok',
        product: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: 'Post product failure!'
      })
    });
  };

  deleteProduct(req, res) {
    const id = req.body.id;
    // console.log('id-delete', id)
    ProductModel.findByIdAndDelete(id)
      .then(result => {
        res.status(200).json({ message: 'ok' })
      })
      .catch(err => {
        res.status(400).json({message: 'Delete failure'})
      })
  };

  getEditProduct(req, res) {
    const productId = req.params.id;
    ProductModel.findById(productId)
      .then(product => {
        // const product = products[0];
        if(!product) {
          return res.status(200).json({ message: 'Not found product', errCode: 1 })
        }
        return res.status(200).json({
          product: product,
          message: 'ok'
        })
      })
      .catch(err => {
        res.status(400).json({ message: err, errCode: -1 })
      });
  };

  editProduct(req, res) {
    const productId = req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    console.log('edit-product', title);
    const error = validationResult(req);
    if(!error.isEmpty()) {
      return res.status(422).json({message : error.array()[0]});
    }
    ProductModel.findById(productId)
      .then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
      })
      .then(result => {
        res.status(200).json({ message: 'ok' })
      })
      .catch(err => res.status(400).json({ message: 'Not found product', errCode: 1}));
  };

}

module.exports = new ProductController;