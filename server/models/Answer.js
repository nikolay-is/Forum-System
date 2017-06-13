const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
const ObjectId = mongoose.Schema.Types.ObjectId

let answerSchema = mongoose.Schema({
  content: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  creator: { type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  thread: { type: ObjectId, ref: 'Thread' },
  date: { type: Date, default: Date.now }
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
