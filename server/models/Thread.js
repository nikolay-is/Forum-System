const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
const ObjectId = mongoose.Schema.Types.ObjectId

let maxDate = new Date(8640000000000000)
let minDate = new Date(-8640000000000000)

let threadSchema = mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  description: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  author: { type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  date: { type: Date, default: Date.now },
  lastAnswerDate: { type: Date, default: minDate },
  category: { type: ObjectId, ref: 'Category' },
  answers: [ { type: ObjectId, ref: 'Answer' } ],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
