const mongoose = require('mongoose');
// const MongoClient = mongodb.MongoClient;

let _db;

const connectMongodb = (cb) => {
  mongoose.connect('mongodb+srv://thuantruong:gMOcUbEFedwxY8RV@cluster0.gl2bqhl.mongodb.net/shops?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
      console.log('Connect to mongodb!')
      cb(client)
    })
    .catch(err => {
      console.log('fail')
      console.log(err)
    })
};

// const getDb = () => {
//   if(_db) {
//     console.log('success')
//     return _db;
//   }
//   console.log('Failure!')
// }

module.exports = connectMongodb;
// exports.connectMongodb = connectMongodb;
// exports.getDb = getDb;

// mongodb+srv://thuantruong:gMOcUbEFedwxY8RV@cluster0.gl2bqhl.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://thuantruong:gMOcUbEFedwxY8RV@cluster0.gl2bqhl.mongodb.net/test