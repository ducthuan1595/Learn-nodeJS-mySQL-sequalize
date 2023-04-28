const Product = require('../models/product');

class ProductController {

  getProducts(req, res) {
    Product.findAll()
      .then((result) => {
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
    // C1:
    // Product.findAll({ where: { id: productId } })
    //   .then(product => {
    //     res.status(200).json({
    //       product: product,
    //       message: 'ok'
    //     })
    //   })
    //   .catch(err => {
    //     res.status(400).json({ message: 'Get Detail failure!' })
    //   });

    // C2:
    Product.findByPk(productId)
    .then(product => {
      res.status(200).json({
        product: product,
        message: 'ok'
      })
    })
    .catch(err => {
      res.status(400).json({ message: 'Get Detail failure!' })
    });
  }

  postAddProduct(req, res) {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log('add-product', result);
      res.status(200).json({
        message: 'ok'
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
    Product.findByPk(id)
      .then(product => {
        return product.destroy();
      })
      .then(result => {
        res.status(200).json({ message: 'ok' })
      })
      .catch(err => {
        res.status(400).json({message: 'Delete failure'})
      })
  };

  getEditProduct(req, res) {
    const productId = req.params.id;
    req.user.getProducts({ where: { id: productId } })
      .then(products => {
        const product = products[0];
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
    console.log('post-edit', productId)
    Product.findByPk(productId)
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