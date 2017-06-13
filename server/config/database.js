const mongoose = require('mongoose')
const User = require('../models/User')
const Category = require('../models/Category')

// require('../models/xxx')
// require('../models/Category')
require('../models/Thread')
require('../models/Answer')

mongoose.Promise = global.Promise

module.exports = (settings) => {
  mongoose.connect(settings.dbStr)
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log(`MongoDB connected to "${settings.dbName}" database on port: ${settings.dbPort}`)

    User.seedAdminUser()
    Category.seedCategory()
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
