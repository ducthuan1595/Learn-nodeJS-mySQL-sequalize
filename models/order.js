const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  products: [{
    productData: { type: Object, required: true },
    quantity: { type: Number, required: true }
  }],
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    }
  }
}, { timestamps: true });

module.exports = OrderModel = mongoose.model('order', schema);