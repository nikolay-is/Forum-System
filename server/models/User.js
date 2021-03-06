const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const errorHandler = require('../utilities/error-handler')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  firstName: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  lastName: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  salt: { type: String },
  hashedPass: { type: String },
  roles: [String],
  blocked: { type: Boolean, default: false }
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
  // ,
  // hasRole: function (roleName) {
  //   return User.findOne({roles: roleName})
  //     .then(role => {
  //       if (!role) {
  //         return false
  //       }
  //       let isInRole = this.roles.indexOf(role.id) !== -1
  //       return isInRole
  //     })
  // }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(user => {
    if (user.length > 0) return

    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, '123')

    User.create({
      username: 'admin',
      firstName: 'Chuck',
      lastName: 'Norris',
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    })
    .catch(err => {
      let message = errorHandler.handleMongooseError(err)
      console.log(`mongoose >> ${message}`)
    })
  })
}
