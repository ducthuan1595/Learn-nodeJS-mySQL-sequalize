// const Cart = require('../models/cart');
// const Order = require('../models/order');
// const Product = require('../models/product');

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

// exports.addProductCart = (req, res) => {
//   const productId = req.body.id;
//   let fetchedCart;
//   let newQuality = 1;
//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then(products => {
//       let product;
//       if(products.length > 0) {
//         product = products[0]
//       }
//       if(product) {
//         const  oldQuality = product.cartItems.quality;
//         newQuality = oldQuality + 1;
//         return product;
//       }
//       return Product.findByPk(productId);
//     })
//     .then(product => {
//       console.log('item-cart', product)
//       return fetchedCart.addProduct(product, {
//         through: { quality: newQuality }
//       });
//     })
//     .then((result)=> {
//       res.status(200).json({
//         message: 'ok',
//         result: result
//       })
//     })
//     .catch(err => {
//       res.status(400).json({
//         message: err.message,
//         errCode: 1
//       })
//     })
// };

// exports.getCart = (req, res) => {
//   req.user.getCart()
//   .then(cart => {
//       // console.log('cart-get', cart)
//       return cart.getProducts()
//         .then(products => {
//           if(products) {
//             res.status(200).json({
//               message: 'ok',
//               carts: products
//             })
//           }else {
//             res.status(400).json({ message: 'Get cart failure', errCode: 1 })
//           }
//         })
//         .catch(err => console.log(err))
//     })
//     .catch(err => {
//       return res.status(400).json( {message: err, errCode: -1})
//     });
// };

// exports.deleteCart = (req, res) => {
//   const productId = req.body.id;
//   console.log('delete-id', productId)
//   req.user.getCart()
//     .then(cart => {
//       console.log('cartD;ete', cart)
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then(products => {
//       console.log('cart-delte', products)
//       const product = products[0];
//       return product.cartItems.destroy();
//     })
//     .then(result => {
//       return res.status(200).json({ message: 'ok' })
//     })
//     .catch(err => {
//       return res.status(400).json({ message: err, errCode: -1});
//     })
// };

// exports.getOrders = (req, res) => {
//   req.user.getOrders({ include: ['products']})
//     .then(orders => {
//       res.status(200).json({
//         message: 'ok',
//         orders: orders
//       })
//     })
//     .catch(err => {
//       res.status(400).json({ message: err, errCode: 1 })
//     })
// };

// exports.postOrder = (req, res) => {
//   let fetchedCart;
//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       return req.user.createOrder()
//         .then(order => {
//           return order.addProducts(products.map(product => {
//             product.orderItems = { quality: product.cartItems.quality };
//             return product
//           }))
//         })
//         .catch(err => {
//           res.status(200).json({ message: err, errCode: 1 })
//         })
//     })
//     .then(result => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(result => {
//       res.status(200).json({
//         message: 'ok',
//       })
//     })
//     .catch(err => {
//       res.status(400).json({
//         message: err,
//         errCode: -1
//       })
//     })
// }