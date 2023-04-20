const Product = require('../models/product');

class ProductController {

  getProducts(req, res) {
    Product.fetchAll()
      .then(([rows, fieldData]) => {
        res.status(200).json({
          products: rows,
          message: 'ok'
        });
        // console.log('product', rows)
      })
      .catch(err => console.log(err));
  };

  postAddProduct(req, res) {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(null, price, imageUrl, description, title);
    console.log('add product controller', product)
    product.save()
      .then(() => res.status(200).json({ message: 'ok' }))
      .catch(err => res.status(200).json({ message: err}))
  }
}

module.exports = new ProductController;