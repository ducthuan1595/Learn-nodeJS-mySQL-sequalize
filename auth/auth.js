const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

class Authorization {

  authToken(req, res, next) {
    const authorization = req.headers['authorization'];
    // console.log('headers', req.headers);
    const token = authorization?.split(' ')[1];  
    if (!token) res.status(401).json("You're not authenticated");
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) {
          res.status(403).json('Token is not valid')
        }else {
          req.user = data;
          next();
        }

      });
    }
  };


}

module.exports = new Authorization();
