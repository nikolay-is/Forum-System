const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Thread = mongoose.model('Thread')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('category/add')
  },
  addPost: (req, res) => {
    let categoryReq = req.body

    Category.create({
      name: categoryReq.name
    })
    .then(() => {
      res.redirect('/categories')
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.redirect('/category/add', categoryReq)
    })
  },
  list: (req, res) => {
    Category.find()
    .then(categories => {
      if (!categories) {
        res.locals.globalError = 'Categories is empty!'
        res.redirect('/categories')
        return
      }
      res.render('category/list', {
        categories: categories
      })
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.redirect('/categories')
    })
  },
  delete: (req, res) => {
    let id = req.params.id
    Category.findByIdAndRemove(id)
      .then(() => {
        res.redirect('/categories')
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/categories')
      })
  },
  getThreadsByCategory: (req, res) => {
    let catName = req.params.name
    Category.findOne({ name: catName })
      .then(category => {
        Thread.find({category: category._id})
          .populate('author')
          .then(threads => {
            res.render('category/threads-by-category', {
              threads: threads,
              category: category
            })
          })
      })
  }
}
