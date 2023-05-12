const express = require('express');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');

const router = express.Router();

const route = (app) => {
  router.get('/', productController.getProducts);
  router.post('/', productController.postAddProduct);
  router.get('/detail/:id', productController.getDetailProduct);
  router.get('/get-edit/:id', productController.getEditProduct);
  router.post('/edit/:id', productController.editProduct);
  router.post('/delete', productController.deleteProduct);
  
  router.post('/add-cart', cartController.addProductCart);
  router.get('/get-cart', cartController.getCart);
  router.post('/delete-cart', cartController.deleteCart);

  router.get('/get-orders', cartController.getOrders);
  router.post('/post-order', cartController.postOrder);

  router.post('/signup', userController.signup);
  router.post('/login', userController.login);
  router.get('/get-login', userController.getLogin);
  router.post('/logout', userController.logout);

  return app.use('/', router);
}

module.exports = route;