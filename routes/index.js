const express = require('express');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');
const authorization = require('../auth/auth');

const router = express.Router();

const route = (app) => {
  router.get('/', productController.getProducts);
  router.post('/', authorization.authToken, productController.postAddProduct);
  router.get('/detail/:id', productController.getDetailProduct);
  router.get('/get-edit/:id', authorization.authToken, productController.getEditProduct);
  router.post('/edit/:id', authorization.authToken, productController.editProduct);
  router.post('/delete', authorization.authToken, productController.deleteProduct);
  
  router.post('/add-cart', authorization.authToken, cartController.addProductCart);
  router.get('/get-cart', authorization.authToken, cartController.getCart);
  router.post('/delete-cart', authorization.authToken, cartController.deleteCart);

  router.get('/get-orders', authorization.authToken, cartController.getOrders);
  router.post('/post-order', authorization.authToken, cartController.postOrder);

  router.post('/signup', userController.signup);
  router.post('/login', userController.login);
  router.get('/refresh-token', userController.refreshTokens);
  router.post('/logout', authorization.authToken, userController.logout);

  return app.use('/', router);
}

module.exports = route;