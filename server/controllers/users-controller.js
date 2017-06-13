const encryprion = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validation
    // if (reqUser.username.lenght < 3)

    let salt = encryprion.generateSalt()
    let hashedPassword = encryprion.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword,
      roles: ['User']
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) { // locals - can access in all views and ...
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({username: reqUser.username}).then(user => {
      if (!user) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
        }

        res.redirect('/')
      })
    })
  },
  profile: (req, res) => {
    res.render('users/profile', {
      user: req.user
    })
  }
}
