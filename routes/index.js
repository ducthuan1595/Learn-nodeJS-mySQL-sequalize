const express = require('express');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

const router = express.Router();

const route = (app) => {
  router.get('/', productController.getProducts);
  router.post('/', productController.postAddProduct);
  router.post('/delete', productController.deleteProduct);
  router.get('/detail/:id', productController.getDetailProduct);
  
  router.post('/add-cart', cartController.addProductCart);

  return app.use('/', router);
}

module.exports = route;