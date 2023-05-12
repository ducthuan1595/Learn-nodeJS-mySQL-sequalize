const UserModel = require("../models/user");

class User {
  signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    UserModel.find()
      .then(users => {
        const isEmail = users.some(user => user.email === email)
        return isEmail;
      })
      .then(isEmail => {
        if(isEmail) {
          return res.status(200).json({ message: 'Email already used.'})
        }
        const user = new UserModel({
          email: email,
          password: password
        });
        user.save()
        .then(user => {
          res.status(200).json({ message: 'ok', user: user })
        })
      })
      .catch(err => res.status(400).json({ message: err }))
  };

  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    req.session.isLoggedIn = true;
    UserModel.find()
      .then(users => {
        const isUser = users.some(user => {
          if(user.email === email && user.password === password) {
            return true;
          }
        })
        return isUser;
      })
      .then(user => {
        if(user) {
          return res.status(200).json({ message: 'ok', user: user })
        }
        res.status(400).json({ message: 'Information invalid.'})
      })
      .catch(err => res.status(400).json({ message: err }))
  };

  getLogin(req, res) {
    const session = req.session.isLoggedIn;
    res.status(200).json({ message: 'ok', session: session })
  }

  logout(req, res) {
    req.session.destroy()
      .then(() => {
        res.status(200).json({ message: 'ok' })
      })
      .catch(err => {
        res.status(400).json({ message: err })
      })
  }
}

module.exports = new User;