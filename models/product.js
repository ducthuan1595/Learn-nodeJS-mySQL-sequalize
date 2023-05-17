const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: Buffer,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: { //create relationship with user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', //get users in product model
    required: true
  }
}, { timestamps: true });

module.exports = ProductModel = mongoose.model('products', schema);
// module.exports = mongoose.model('Product', schema);