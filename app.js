const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Middleware with user 
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
});

route(app);

// CREATE RELATION FOR MODALS
// onDelete if use to be delete all product of user too destroy
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({force: true})
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if(!user) {
      return User.create({ name: 'Max', email: 'test@test.com' })
    }
    return user;
  })
  .then(user => {
    // user.getCart()
    // .then((cart)=> {
    //   if(!cart) {
    //     return user.createCart();
    //   }
    //   return cart;
    // })
    return user.createCart();

  })
  .then(()=> {
    app.listen(port, ()=> {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

