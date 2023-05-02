const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes');
const connectMongodb = require('./util/database');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Middleware with user 
app.use((req, res, next) => {
//   User.findByPk(1)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err))
  next();
});

route(app);

connectMongodb((cb) => {
  // console.log('callback',cb);
  if(cb) {
    app.listen(port, ()=> {
      console.log(`Server is running on port ${port}`);
    });
  }
})

