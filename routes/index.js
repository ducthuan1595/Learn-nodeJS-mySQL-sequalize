const express = require("express");
const { check, body } = require("express-validator");

const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const userController = require("../controllers/userController");
const authorization = require("../auth/auth");

const router = express.Router();

const route = (app) => {
  router.get("/", productController.getProducts);
  router.post(
    "/",
    [
      body("title").isLength({ min: 3 }).trim(),
      body('imageUrl'),
      body("price").isFloat(),
      body("description").isLength({ min: 5 }),
    ],
    // authorization.authToken,
    productController.postAddProduct
  );
  router.get("/detail/:id", productController.getDetailProduct);
  router.get(
    "/get-edit/:id",
    authorization.authToken,
    productController.getEditProduct
  );
  router.post(
    "/edit/:id",
    [
      body("title").isLength({ min: 3 }).trim(),
      body('imageUrl'),
      body("price").isNumeric(),
      body("description").isLength({ min: 5 }),
    ],
    authorization.authToken,
    productController.editProduct
  );
  router.post(
    "/delete",
    authorization.authToken,
    productController.deleteProduct
  );

  router.post(
    "/add-cart",
    authorization.authToken,
    cartController.addProductCart
  );
  router.get("/get-cart", authorization.authToken, cartController.getCart);
  router.post(
    "/delete-cart",
    authorization.authToken,
    cartController.deleteCart
  );

  router.get("/get-orders", authorization.authToken, cartController.getOrders);
  router.post("/post-order", authorization.authToken, cartController.postOrder);
  router.get('/order/:orderId', cartController.getInvoice);

  router.post(
    "/signup",
    [
      check("email").isEmail().notEmpty().escape(),
      body("password").isLength({ min: 9 }),
    ],
    userController.signup
  );
  router.post(
    "/login",
    check("email").isEmail().notEmpty().escape(),
    userController.login
  );
  router.get("/refresh-token", userController.refreshTokens);
  router.post("/logout", userController.logout);

  return app.use("/", router);
};

module.exports = route;
