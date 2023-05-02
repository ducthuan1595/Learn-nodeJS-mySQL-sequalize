const express = require('express');
const productController = require('../controllers/productController');
// const cartController = require('../controllers/cartController');

const router = express.Router();

const route = (app) => {
  router.get('/', productController.getProducts);
  router.post('/', productController.postAddProduct);
  // router.post('/delete', productController.deleteProduct);
  // router.get('/detail/:id', productController.getDetailProduct);
  // router.get('/get-edit/:id', productController.getEditProduct);
  // router.post('/edit/:id', productController.editProduct);
  
  // router.post('/add-cart', cartController.addProductCart);
  // router.get('/get-cart', cartController.getCart);
  // router.post('/delete-cart', cartController.deleteCart);

  // router.get('/get-order', cartController.getOrders);
  // router.post('/post-order', cartController.postOrder);

  return app.use('/', router);
}

module.exports = route;