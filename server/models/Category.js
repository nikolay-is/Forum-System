const mongoose = require('mongoose')
const errorHandler = require('../utilities/error-handler')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let categorySchema = mongoose.Schema({
  name: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true }
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category

module.exports.seedCategory = () => {
  Category.find({}).then(categories => {
    if (categories.length > 0) return

    Category.create({
      name: 'Common'
    })
    .catch(err => {
      let message = errorHandler.handleMongooseError(err)
      console.log(`mongoose >> ${message}`)
    })
  })
}
