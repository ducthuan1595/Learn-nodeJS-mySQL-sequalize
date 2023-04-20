const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'datas', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // create cart.json
      let cart = { products: [], totalPrice: 0 };
      // get product from file cart.json
      if(!err) {
        cart = JSON.parse(fileContent);
      }
      // add product when existing cart 
      // console.log('product-model-products', cart.products)
      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      // console.log('product-model-exis', existingProductIndex)
      // console.log('product-model-id', id)
      let updateProduct;
      // when used to product
      if(existingProduct) {
        updateProduct = { ...existingProduct };
        updateProduct.qty = updateProduct.qty + 1;
        cart.products = [ ...cart.products ];
        cart.products[existingProductIndex] = updateProduct;
      }
      // when not has product
      else {
        // console.log('match')
        updateProduct = { id: id, qty: 1 };
        cart.products = [ ...cart.products, updateProduct];
      }
      // save product to cart
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  };

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if(err) {
        return;
      }
      const updateCart = { ...JSON.parse(fileContent)};
      const product = updateCart.products.find(p => p.id === id);
      if(!product) {
        return;
      }
      const productQty = product.qty;
      updateCart.products = updateCart.products.filter(p => p.id !== id);
      updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updateCart), err => {
        console.log(err);
      });
    });
  };

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if(err) {
        cb(null);
      }else {
        cb(cart);
      }
    });
  };

};
