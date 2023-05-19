const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const route = require('./routes');
const connectMongodb = require('./util/database');
const UserModel = require('./models/user');
const multer = require('multer');
const path = require('path');
const fileUpload = require('express-fileupload');
// const authorization = require('./auth/auth');


const app = express();
dotenv.config();
const port = process.env.ACCESS_URL;

// app.use(session({
//   secret: 'my secret',
//   resave: false,
//   saveUninitialized: true,
// }))
app.use('/images', express.static(path.join(__dirname, 'images')));

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'image');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });
// console.log('file-storage', fileStorage.destination);
// const fileFilter = (req, file, cb) => {
//   if(file.mimetype === 'image/png' || file.mimetype ==='image/jpg' || file.mimetype === 'image/jpeg') {
//     cb(null, true)
//   }else  {
//     cb(null, false)
//   }
// }
// console.log('file-storage', fileFilter);

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('imageUrl')); //config add file
app.use(bodyParser.json()); 
app.use(cors());

// Middleware
// app.use(authorization.authToken, (req, res, next) => {
//   console.log('user-curr-app', req.user);
//   UserModel.findOne(req.user)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err))
// })

route(app);

connectMongodb((cb) => {
  if(cb) {
    app.listen(port, ()=> {
      console.log(`Server is running on port ${port}`);
    });
  }
})

