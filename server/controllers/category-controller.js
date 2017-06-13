const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    Category.find()
      .then((categories) => {
        res.render('category/add', {categories: categories})
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/categories')
      })
  },
  addPost: (req, res) => {
    let categoryReq = req.body
    console.log(`req: ${categoryReq}`)
    Category.create({
      name: categoryReq.name
    })
    .then((category) => {
      console.log(category)
      res.redirect('/categories')
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.redirect('/categories')
    })
  },
  list: (req, res) => {
    Category.find({})
    .then(categories => {
      if (!categories) {
        res.locals.globalError = 'Categories is empty!'
        res.redirect('/categories')
      }
      res.render('category/list', {
        categories: categories
      })
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.render('category/list')
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
  }
}
