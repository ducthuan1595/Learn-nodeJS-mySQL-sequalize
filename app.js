const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes');
const sequelize = require('./util/database');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

route(app);

sequelize
  // .sync({force: true})
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(port, ()=> {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

