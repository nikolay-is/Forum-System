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
  },
  editGet: (req, res) => {
    let id = req.params.id
    Answer.findById(id)
      .populate('author')
      .populate('thread')
      .then(answer => {
        res.render('answer/edit', {
          answer: answer
        })
      })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let answerReq = req.body
    Answer.findById(id)
      .populate('author')
      .populate('thread')
      .then(answer => {
        answer.content = answerReq.content
        answer
          .save()
          .then(() => {
            res.redirect(`/post/${answer.thread._id}/${answer.thread.title}`)
          })
      })
  },
  deleteGet: (req, res) => {
    let id = req.params.id
    Answer.findById(id)
      .populate('author')
      .populate('thread')
      .then(answer => {
        res.render('answer/delete', { answer: answer })
      })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Answer.findByIdAndRemove(id)
      .populate('thread')
      .then(answer => {
        Thread.findByIdAndUpdate(answer.thread._id, { $pull: { answer: { $in: [id] } } })
          .then(() => {
            res.redirect(`/post/${answer.thread._id}/${answer.thread.title}`)
          })
      })
  }
}
