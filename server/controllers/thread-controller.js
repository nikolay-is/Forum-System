const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Category = mongoose.model('Category')
const Answer = mongoose.model('Answer')
const errorHandler = require('../utilities/error-handler')

let minDate = new Date(-8640000000000000)

module.exports = {
  index: (req, res) => {
    Thread.find() // $ne
  // Thread.find({lastAnswerDate: { $gt: minDate }}) // $ne
    .populate('author')
    .sort('-lastAnswerDate')
    .populate('category')
    // .populate('answers')
    .limit(20)
    .then(threads => {
      if (!threads) {
        res.locals.globalError = 'Threads is empty!'
        res.redirect('/')
        return
      }
      res.render('home/index', {
        threads: threads
      })
    })
    .catch(err => {
      let message = errorHandler.handleMongooseError(err)
      res.locals.globalError = message
      res.redirect('/')
    })
  },
  addGet: (req, res) => {
    if (req.user.isBlocked) {
      res.locals.globalError = 'You are blocked!'
      res.redirect('/')
      return
    }
    Category.find()
      .then(categories => {
        if (!categories) {
          res.locals.globalError = 'Categories is empty!'
          res.redirect('/')
          return
        }
        res.render('thread/add', {
          categories: categories
        })
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
  addPost: (req, res) => {
    if (req.user.isBlocked) {
      res.redirect('/')
      return
    }
    let thredReq = req.body
    let categoryId = thredReq.category
    Thread.create({
      title: thredReq.title,
      description: thredReq.description,
      category: categoryId,
      author: req.user._id
    })
    .then(thread => {
      let threadId = thread._id
      Category.findByIdAndUpdate(categoryId, { $addToSet: { threads: threadId } })
        .then(() => {
          res.redirect(`/post/${thread._id}/${thread.title}`)
        })
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.render('thread/add', {
        thread: thredReq
      })
    })
  },
  list: (req, res) => {
    let pageSize = 20
    let page = Number(req.query.page) || 1

    Thread.find() // $ne
    // Thread.find({lastAnswerDate: { $gt: minDate }}) // $ne
      .populate('author')
      .populate('category')
      .sort('-lastAnswerDate')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(threads => {
        if (!threads) {
          res.locals.globalError = 'Threads is empty!'
          res.redirect('/')
          return
        }
        res.render('thread/list', {
          threads: threads,
          hasPrevPage: page > 1,
          hasNextPage: threads.length === pageSize,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/')
      })
  },
  editGet: (req, res) => {
    let id = req.params.id

    Thread.findById(id)
      .then(thread => {
        Category.find()
        .then(categories => {
          if (!categories) {
            res.locals.globalError = 'Categories is empty!'
            res.redirect('/categories')
          }

          res.render('thread/edit', {
            thread: thread,
            categories: categories
          })
        .catch(err => {
          res.locals.globalError = errorHandler.handleMongooseError(err)
          res.redirect('/categories')
        })
        })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/list')
      })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let threadReq = req.body

    Thread.findById(id)
      .then(thread => {
        let oldCategory = thread.category
        thread.title = threadReq.title
        thread.description = threadReq.description
        thread.category = threadReq.category
        thread.save()
          .then(() => {
            if (oldCategory !== threadReq.category) {
              Category.findByIdAndUpdate(oldCategory, { $pull: { threads: { $in: [thread._id] } } })
              .then(() => {
                Category.findByIdAndUpdate(thread.category, { $push: { threads: { _id: thread._id } } })
                .then(() => {
                  res.redirect(`/post/${thread._id}/${thread.title}`)
                })
              })
            }
            res.redirect(`/post/${thread._id}/${thread.title}`)
          })
          .catch(err => {
            res.locals.globalError = errorHandler.handleMongooseError(err)
            res.redirect('/list')
          })
      }).catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/list')
      })
  },
  delete: (req, res) => {
    let id = req.params.id
    Thread.findByIdAndRemove(id)
      .then((thread) => {
        Answer.remove({ thread: id })
          .then(() => {
            Category.findByIdAndUpdate(thread.category, { $pull: { threads: { $in: [id] } } })
            .then()
          })
        res.redirect('/list')
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/list')
      })
  },
  detailsGet: (req, res) => {
    let id = req.params.id
    Thread.findById(id)
      .populate('author')
      .populate('category')
      // .populate('answer')
      .then(thread => {
        Answer.find({ thread: thread._id })
          .populate('author')
          .sort('date')
          .then(answers => {
            thread.views = thread.views + 1
            thread.save()
              .then(thread => {
                if (req.user) {
                  res.render('thread/details', {
                    thread: thread,
                    answers: answers
                  })
                }
              })
              .catch(err => {
                res.locals.globalError = errorHandler.handleMongooseError(err)
                // res.redirect('/list')
                res.render('home/index')
              })
          })
          .catch(err => {
            res.locals.globalError = errorHandler.handleMongooseError(err)
            // res.redirect('/list')
            res.render('home/index')
          })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        // res.redirect('/list')
        res.render('home/index')
      })
  },
  like: (req, res) => {
    let id = req.params.id

    Thread.findById(id)
      .then(thread => {
        thread.likes = thread.likes + 1
        thread.save()
          .then(() => {
            res.redirect(`/post/${thread._id}/${thread.title}`)
          })
      })
  },
  dislike: (req, res) => {
    let id = req.params.id

    Thread.findById(id)
      .then(thread => {
        thread.likes = thread.likes - 1
        thread.save()
          .then(() => {
            res.redirect(`/post/${thread._id}/${thread.title}`)
          })
      })
  }
}
