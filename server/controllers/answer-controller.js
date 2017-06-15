const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addPost: (req, res) => {
    let id = req.params.id
    let answerReq = req.body
    if (!req.user.isBlocked) {
      Answer.create({
        content: answerReq.content,
        author: req.user._id,
        thread: id
      })
      .then(answer => {
        Thread.findById(id)
          .populate('author')
          .then(thread => {
            thread.answers.push(answer._id)
            thread.lastAnswerDate = answer.date
            thread.save()
              .then(thread => {
                Answer
                .find({ thread: thread._id })
                .populate('author')
                .sort('date')
                .then(answers => {
                  res.render('thread/details', {
                    thread: thread,
                    answers: answers
                  })
                })
                .catch(err => {
                  res.locals.globalError = errorHandler.handleMongooseError(err)
                  res.redirect('/')
                })
              })
              .catch(err => {
                res.locals.globalError = errorHandler.handleMongooseError(err)
                res.redirect('/')
              })
          })
          .catch(err => {
            res.locals.globalError = errorHandler.handleMongooseError(err)
            res.redirect('/')
          })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/')
      })
    }
  }
}
