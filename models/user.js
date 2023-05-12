const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

//create methods with schema
schema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((item) => {
    return item.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updateCartItem = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
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
  this.cart = updatedCart;
  return this.save();
};

schema.methods.deleteCart = function(productId) {
  const updateCartItem = this.cart.items.filter(item => {
    return item.productId === productId;
  });
  this.cart.items = updateCartItem;
  return this.save();
};

schema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
}

module.exports = UserModel = mongoose.model("users", schema);
