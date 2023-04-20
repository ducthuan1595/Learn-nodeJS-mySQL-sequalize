const db = require('../util/database');

module.exports = class Product {
  constructor(id, price, imageUrl, description, title) {
    this.id = id;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.title = title;
  }

  save() {
    return db.execute('insert into products (title, price, description, imageUrl) values (?, ?, ?, ?)', [
      this.title, this.price, this.description, this.imageUrl
    ])
  }

  static fetchAll() {
    return db.execute('select * from products');
  };

  static findById(id) {
    return db.execute('select * from products where products.id = ?', [id]);
  }
};
