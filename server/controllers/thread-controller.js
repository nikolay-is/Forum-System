const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Category = mongoose.model('Category')
const Answer = mongoose.model('Answer')
const errorHandler = require('../utilities/error-handler')

let minDate = new Date(-8640000000000000)

module.exports = {
  index: (req, res) => {
    Thread.find({}) // $ne
  // Thread.find({lastAnswerDate: { $gt: minDate }}) // $ne
    .sort('-lastAnswerDate')
    .populate('category')
    .populate('answers')
    .then(threads => {
      if (!threads) {
        let message = 'Threads is empty!'
        res.locals.globalError = message
        res.redirect('/')
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
    Category.find({})
      .then(categories => {
        if (!categories) {
          let message = 'Categories is empty!'
          res.locals.globalError = message
          res.redirect('/')
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
    // Thread.find({})
    //   .then((threads) => {

    //   })
  },
  addPost: (req, res) => {
    let thredReq = req.body
    Thread.create({
      title: thredReq.title,
      description: thredReq.description,
      category: thredReq.category
    })
    .then(category => {
      res.redirect('/list')
    })
    .catch(err => {
      let message = errorHandler.handleMongooseError(err)
      res.locals.globalError = message
      res.render('thread/add', thredReq)
    })
  },
  list: (req, res) => {
    Thread.find({}) // $ne
    // Thread.find({lastAnswerDate: { $gt: minDate }}) // $ne
      .sort('-lastAnswerDate')
      .populate('category')
      .then(threads => {
        if (!threads) {
          let message = 'Threads is empty!'
          res.locals.globalError = message
          res.redirect('/')
        }
        res.render('thread/list', {
          threads: threads
        })
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
        // .populate('category')
      // .populate('answers')

  editGet: (req, res) => {
    let id = req.params.id
    Thread.findById(id)
      .populate('category')
      .then(thread => {
        console.log(thread)
        Category.find({})
        .then(categories => {
          if (!categories) {
            res.locals.globalError = 'Categories is empty!'
            res.redirect('/categories')
          }
          console.log(categories)
          let editedThread = {
            title: thread.title,
            description: thread.description,
            categories: categories
          }

          res.render('thread/edit', {
            thread: editedThread
          })
        .catch(err => {
          res.locals.globalError = errorHandler.handleMongooseError(err)
          res.redirect('/list')
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
        thread.title = threadReq.title
        thread.description = threadReq.description
        thread.save()
          .then(() => {
            res.redirect('/list')
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
      .then(() => {
        res.redirect('/list')
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/list')
      })
  },
  detailsGet: (req, res) => {
    // console.log(req.params.id)
    // console.log(req.params.name)
    let id = req.params.id
    Thread.findById(id)
      .populate('category')
      .populate('answer')
      .then(thread => {
        res.render('thread/details', {
          thread: thread
        })
      })
  },
  detailsPost: (req, res) => {
    let id = req.params.id
    let threadReq = req.body
    console.log(req.params)
    console.log(threadReq)
    Answer.create({
      content: threadReq.content
    })
      // .then(thread => {
      //   thread.title = threadReq.title
      //   thread.description = threadReq.description
      //   thread.save()
      //     .then(() => {
      //       res.redirect('/list')
      //     })
      //     .catch(err => {
      //       res.locals.globalError = errorHandler.handleMongooseError(err)
      //       res.redirect('/list')
      //     })
      // }).catch(err => {
      //   res.locals.globalError = errorHandler.handleMongooseError(err)
      //   res.redirect('/list')
      // })
  }
}
