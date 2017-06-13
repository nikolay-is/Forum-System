const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let answerSchema = mongoose.Schema({
  content: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  date: { type: Date, default: Date.now }
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
