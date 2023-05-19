const path = require("path");
const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const UserModel = require("../models/user");
const fileHelp = require('../util/file');


const addToCart = async (product, req) => {
  const user = await UserModel.findById(req.user._id);
  const cartProductIndex = user.cart.items.findIndex((item) => {
    return item.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updateCartItem = [...user.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = user.cart.items[cartProductIndex].quantity + 1;
    updateCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updateCartItem.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updateCartItem,
  };
  // req.user.cart = updatedCart;
  return UserModel.findOneAndUpdate(
    { _id: req.user._id },
    { cart: updatedCart }
  );
};

exports.addProductCart = (req, res) => {
  const productId = req.body.id;
  ProductModel.findById(productId)
    .then((product) => {
      return addToCart(product, req);
    })
    .then((result) => {
      res.status(200).json({
        message: "ok",
        result: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
        errCode: 1,
      });
    });
};

exports.getCart = (req, res) => {
  UserModel.findById(req.user._id)
    .populate("cart.items.productId")
    // .execPopulate() //return promise
    .then((user) => {
      // console.log('get-cart', user.cart);
      const products = user.cart.items;
      if (products) {
        res.status(200).json({
          message: "ok",
          carts: products,
        });
      } else {
        res.status(400).json({ message: "Get cart failure", errCode: 1 });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: err, errCode: -1 });
    });
};

exports.deleteCart = (req, res) => {
  const id = req.body.id;
  // req.user.deleteCart(productId)
  UserModel.findById(req.user._id)
    .then((user) => {
      const updateCart = { ...user.cart };
      const items = user.cart.items.filter(
        (item) => item._id.toString() !== id.toString()
      );
      updateCart.items = items;
      return UserModel.updateOne({ _id: user._id }, { cart: updateCart });
    })
    .then(() => {
      return res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      return res.status(400).json({ message: err, errCode: -1 });
    });
};

exports.getOrders = (req, res) => {
  OrderModel.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.status(200).json({
        message: "ok",
        orders: orders,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err, errCode: 1 });
    });
};

exports.postOrder = (req, res) => {
  UserModel.findById(req.user._id)
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          productData: { ...item.productId._doc },
        }; //_doc help get all information of product
      });
      const order = new OrderModel({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      UserModel.updateOne({_id: req.user._id}, {cart: { items: []}})
        .then(() => {
          res.status(200).json({
            message: "ok",
          });
        })
        .catch(err => res.status(400).json({ message: 'Error update cart.' }))
    })
    .catch((err) => {
      res.status(400).json({
        message: err,
        errCode: 1,
      });
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  OrderModel.findById(orderId)
    .then((order) => {
      if (!order) return res.status(400).json({ message: "Not found order!" });
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("datas", "invoices", invoiceName);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
        );//inline or attachment: inline to show invoice when click / attachment download file
      fileHelp.sendFile(res, order, invoicePath);
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
    .catch((err) => res.status(403).json({ message: "Unauthorized " }));
};
