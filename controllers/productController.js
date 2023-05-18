const ProductModel = require("../models/product");
const { validationResult } = require("express-validator");
const path = require("path");
const fileHelp = require("../util/file");

const p = path.join('datas', 'images', 'image');

class ProductController {
  getProducts(req, res) {
    ProductModel.find()
      //.select('title price - _id') //only get title and price omit _id
      //.populate('userId') //reference to user by userId into product model
      .then((result) => {
        // console.log('get-product', result)
        res.status(200).json({
          products: result,
          message: "ok",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: "Get All products failure!",
        });
      });
  }

  getDetailProduct(req, res) {
    const productId = req.params.id;
    // console.log('id-edit', productId)
    ProductModel.findById(productId)
      .then((product) => {
        res.status(200).json({
          product: product,
          message: "ok",
        });
      })
      .catch((err) => {
        res.status(400).json({ message: err });
      });
  }

  postAddProduct(req, res, next) {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.files.imageUrl;
    const description = req.body.description;
    imageUrl.mv(p + Date.now() + imageUrl.name, function (err) {
      if (err){
        throw new Error(err)
      }
      console.log('Upload success');
    });
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ message: error.array()[0] });
    }
    const product = new ProductModel({
      title: title,
      price: price,
      imageUrl: imageUrl.data,
      description: description,
      userId: req.user._id,
    });
    product
      .save()
      .then((result) => {
        res.status(200).json({
          message: "ok",
          product: result,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        res.status(404).json({
          message: "Post product failure!",
        });
      });
  }

  deleteProduct(req, res) {
    const id = req.body.id;
    console.log('id-delete', id)
    ProductModel.findById(id)
      .then((product) => {
        if (!product) return new Error("Not found product!");
        // console.log('ok', fileHelp.deleteFile());
        // fileHelp.deleteFile(product.imageUrl);
        return ProductModel.findByIdAndDelete(id);
      })
      .then((result) => {
        res.status(200).json({ message: "ok" });
      })
      .catch((err) => res.status(400).json({ message: err }));
  }

  getEditProduct(req, res) {
    const productId = req.params.id;
    ProductModel.findById(productId)
      .then((product) => {
        // const product = products[0];
        if (!product) {
          return res
            .status(200)
            .json({ message: "Not found product", errCode: 1 });
        }
        return res.status(200).json({
          product: product,
          message: "ok",
        });
      })
      .catch((err) => {
        res.status(400).json({ message: err, errCode: -1 });
      });
  }

  editProduct(req, res) {
    const productId = req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.files.imageUrl;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ message: error.array()[0] });
    }
    ProductModel.findById(productId)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          throw new Error("Unauthorized!");
        }
        product.title = title;
        product.price = price;
        product.description = description;
        if (imageUrl) {
          // fileHelp.deleteFile(product.imageUrl);
          product.imageUrl = imageUrl.data;
        }
        return product
          .save()
          .then((result) => {
            res.status(200).json({ message: "ok", result: result });
          })
          .catch((err) => res.status(400).json({ message: err }));
      })
      .catch((err) => res.status(400).json({ message: err, errCode: 1 }));
  }
}

module.exports = new ProductController();
