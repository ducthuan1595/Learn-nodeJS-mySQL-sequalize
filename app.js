const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const route = require('./routes');
const connectMongodb = require('./util/database');
const UserModel = require('./models/user');

const app = express();
dotenv.config();
const port = process.env.ACCESS_URL;

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Middleware
app.use((req, res, next) => {
  UserModel.findOne(req.user)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
})

route(app);

connectMongodb((cb) => {
  if(cb) {
    app.listen(port, ()=> {
      console.log(`Server is running on port ${port}`);
    });
  }
})

