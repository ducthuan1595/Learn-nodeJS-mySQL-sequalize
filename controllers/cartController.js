// const Cart = require('../models/cart');
const OrderModel = require('../models/order');
const ProductModel = require('../models/product');

// // exports.getProducts = (req, res, next) => {
// //   Product.findAll()
// //   .then((result) => {
// //     res.status(200).json({
// //       products: result,
// //       message: 'ok'
// //     });
// //   })
// //   .catch(err => {
// //     console.log(err);
// //     res.status(400).json({
// //       message: 'Get All products failure!'
// //     })
// //   });
// // };

exports.addProductCart = (req, res) => {
  const productId = req.body.id;
  ProductModel.findById(productId)
    .then(product => {
      return req.user.addToCart(product); //addToCart() get into User model
    })
    .then((result)=> {
      res.status(200).json({
        message: 'ok',
        result: result
      })
    })
    .catch(err => {
      res.status(400).json({
        message: err.message,
        errCode: 1
      })
    })
};

exports.getCart = (req, res) => {
  req.user.populate('cart.items.productId')
    // .execPopulate() //return promise
    .then(user => {
      // console.log('cart-get', user.cart.items)
      const products = user.cart.items;
      if(products) {
        res.status(200).json({
          message: 'ok',
          carts: products
        })
      }else {
        res.status(400).json({ message: 'Get cart failure', errCode: 1 })
      }
    })
    .catch(err => {
      return res.status(400).json( {message: err, errCode: -1})
    });
};

exports.deleteCart = (req, res) => {
  const productId = req.body.id;
  console.log('delete-id', productId)
  req.user.deleteCart(productId)
    .then(result => {
      return res.status(200).json({ message: 'ok' })
    })
    .catch(err => {
      return res.status(400).json({ message: err, errCode: -1});
    })
};

exports.getOrders = (req, res) => {
  OrderModel.find({'user.userId': req.user._id})
    .then(orders => {
      console.log('order', orders)
      res.status(200).json({
        message: 'ok',
        orders: orders
      })
    })
    .catch(err => {
      res.status(400).json({ message: err, errCode: 1 })
    })
};

exports.postOrder = (req, res) => {
  req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => {
        return { quantity: item.quantity, productData: {...item.productId._doc} }; //_doc help get all information of product
      });
      const order = new OrderModel({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(()=> {
      // console.log()
      return req.user.clearCart();
    })
    .then(result => {
      res.status(200).json({
        message: 'ok',
      })
    })
    .catch(err => {
      res.status(400).json({
        message: err,
        errCode: 1
      })
    })
}