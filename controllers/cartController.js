// const Cart = require('../models/cart');
const path = require('path');
const OrderModel = require('../models/order');
const ProductModel = require('../models/product');
const fileHelp = require('../util/file');
const fs = require('fs');
const pdfkit = require('pdfkit');

exports.addProductCart = (req, res) => {
  const productId = req.body.id;
  console.log('user', req.user);
  ProductModel.findById(productId)
  .then(product => {
    return req.user.addToCart(product);
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
  console.log('curr-user', req.user);
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
  console.log(req.user);
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
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log('invoice-userId',req.user)
  OrderModel.findById(orderId)
  .then(order => {
      console.log('order',order)
      if(!order) return res.status(400).json({ message: 'Not found order!' });
      if(order.user.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized'});
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('datas', 'invoices', invoiceName);
       res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      fileHelp.sendFile(res, order, invoicePath)
      // const pdfDoc = new pdfkit();
      // pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // pdfDoc.pipe(res);
      // pdfDoc.text('hello world!');
      // pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if(err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename"' + invoiceName + '"'); ///inline to show invoice when click or attachment download file
      //   res.send(JSON.stringify(data));
      // });

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      // file.pipe(JSON.stringify(res))
    })
    .catch(err => res.status(403).json({ message: 'Unauthorized '}))
};