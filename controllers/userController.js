const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
let refreshTokens = [];

class User {
  signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    UserModel.find()
      .then((users) => {
        const isEmail = users.some((user) => user.email === email);
        return isEmail;
      })
      .then((isEmail) => {
        if (isEmail) {
          return res.status(200).json({ message: "Email already used." });
        }
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
        if (!user) res.status(404).json({ message: "Not found user!" });
        const validPs = bcrypt.compare(password, user.password);
        return validPs;
      })
      .then((isValid) => {
        if (isValid) {
          const token = jwt.sign(
            { email: email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
          );
          const refreshToken = jwt.sign(
            { email: email },
            process.env.ACCESS_REFRESH_TOKEN,
            { expiresIn: "30d" }
          );
          refreshTokens.push(refreshToken);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, //deploy to true
            sameSite: "strict",
          });
          return res.status(200).json({ message: "ok", email, token });
        }
        res.status(400).json({ message: "Information invalid." });
      })
      .catch((err) => res.status(400).json({ message: err }));
  }

  refreshTokens(req, res) {
    const refreshTokenFormCookie = req.headers?.cookie.split(";")[0];
    if (!refreshTokenFormCookie)
      return res.status(401).json("You are not authentication");
    else if (!refreshTokens.includes(refreshTokenFormCookie)) {
      return res.status(403).json("Refresh token is not valid");
    } else {
      jwt.verify(
        refreshTokenFormCookie,
        process.env.ACCESS_REFRESH_TOKEN,
        (err, user) => {
          if (err) return console.log(err);
          refreshTokens = refreshTokens.filter(
            (token) => token !== refreshTokenFormCookie
          );
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
          refreshTokens.push(newRefreshToken);
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, //deploy to true
            sameSite: "strict",
          });
          res.status(200).json({ token: newToken });
        }
      );
    }
  }

  logout(req, res) {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("ok");
  }
}

module.exports = new User();
