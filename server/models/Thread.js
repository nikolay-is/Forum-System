const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
const ObjectId = mongoose.Schema.Types.ObjectId

let threadSchema = mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  description: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  date: { type: Date, default: Date.now },
  lastAnswerDate: { type: Date, default: Date.now },
  category: { type: ObjectId, ref: 'Category' },
  answers: [ { type: ObjectId, ref: 'Answer' } ]
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
