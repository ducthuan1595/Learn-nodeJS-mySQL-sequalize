const UserModel = require("../models/user");
const TokenModel = require("../models/token");
const sendMailer = require("../auth/nodemail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { query, validationResult } = require('express-validator');

dotenv.config();
// let refreshTokens = [];

class User {
  signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);
    if(!error.isEmpty()) {
      return res.status(422).json({message : error.array()[0]});
    }
    UserModel.find()
      .then((users) => {
        const isEmail = users.some((user) => user.email === email);
        return isEmail;
      })
      .then((isEmail) => {
        if (isEmail) {
          return res.status(200).json({ message: "Email already used." });
        }
        sendMailer(email, () => {
          console.log('send email success')
        });
        return bcrypt
          .hash(password, 12)
          .then((pw) => {
            const user = new UserModel({
              email: email,
              password: pw,
            });
            user.save();
          })
          .then((user) => {
            res.status(200).json({ message: "ok", user: user });
          });
      })
      .catch((err) => res.status(400).json({ message: err }));
  }

  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    UserModel.findOne({ email: email })
      .then((user) => {
        if (!user) throw "Not found user!";
        else {
          const validPs = bcrypt.compare(password, user.password);
          return validPs;
        }
      })
      .then((isValid) => {
        if (isValid) {
          const token = jwt.sign(
            { email: email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
          );
          const refreshToken = jwt.sign(
            { email: email },
            process.env.ACCESS_REFRESH_TOKEN,
            { expiresIn: "30d" }
          );
          const refreshTokens = new TokenModel({
            refreshToken: refreshToken,
          });
          refreshTokens.save();
          // res.cookie("refreshToken", refreshToken, {
          //   httpOnly: true,
          //   secure: false, //deploy to true
          //   sameSite: "strict",
          // });
          return res
            .status(200)
            .json({ message: "ok", email, token, refreshToken });
        } else {
          res.status(400).json({ message: "Information invalid." });
        }
      })
      .catch((err) => res.status(400).json({ message: err }));
  }

  refreshTokens(req, res) {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json("You are not authentication");
    }
    TokenModel.find()
      .then((tokens) => {
        const isToken = tokens.some((item) => item.refreshToken === token);
        if (!isToken)
          return res.status(401).json({ message: "Token is not valid" });
        return tokens;
      })
      .then((tokens) => {
        jwt.verify(token, process.env.ACCESS_REFRESH_TOKEN, (err, user) => {
          if (err) return console.log(err);
          const filterToken = tokens.filter(
            (item) => item.refreshToken === token
          );
          TokenModel.findOneAndRemove({
            refreshToken: filterToken[0].refreshToken,
          }).then(() => {
            // create new token and refresh token
            const newToken = jwt.sign(
              { email: user.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "30s" }
            );
            const newRefreshToken = jwt.sign(
              { email: user.email },
              process.env.ACCESS_REFRESH_TOKEN,
              { expiresIn: "30d" }
            );
            const refreshTokens = new TokenModel({
              refreshToken: newRefreshToken,
            });
            refreshTokens.save();
            res.status(200).json({
              message: "ok",
              email: user.email,
              token: newToken,
              refreshToken: newRefreshToken,
            });
          });
          // res.cookie("refreshToken", newRefreshToken, {
          //   httpOnly: true,
          //   secure: false, //deploy to true
          //   sameSite: "strict",
          // });
        });
      })
      .catch((err) => {
        return res.status(401).json(err);
      });
  }

  logout(req, res) {
    const refreshToken = req.headers["authorization"].split(" ")[1];
    console.log(refreshToken);
    // res.clearCookie("refreshToken");
    TokenModel.find()
      .then((tokens) => {
        const filterToken = tokens.filter(
          (token) => token.refreshToken === refreshToken
        );
        TokenModel.findOneAndRemove({
          refreshToken: filterToken[0].refreshToken,
        })
          .then(() => {
            res.status(200).json({ message: "ok" });
          })
          .catch((err) =>
            res.status(404).json({ message: "Error on Database" })
          );
      })
      .catch((err) => res.status(400).json({ message: err }));
  }
}

module.exports = new User();
