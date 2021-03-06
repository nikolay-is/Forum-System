const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.thread.index)
  app.get('/about', controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profile)
  app.post('/users/block/:id', controllers.users.block)
  app.post('/users/unblock/:id', controllers.users.unblock)

  app.get('/admins/add', auth.isInRole('Admin'), controllers.users.adminGet)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.adminPost)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.all)

  app.get('/add', auth.isAuthenticated, controllers.thread.addGet)
  app.post('/add', auth.isAuthenticated, controllers.thread.addPost)
  app.get('/list', controllers.thread.list)
  app.get('/delete/:id', auth.isInRole('Admin'), controllers.thread.delete)
  app.get('/edit/:id', auth.isInRole('Admin'), controllers.thread.editGet)
  app.post('/edit/:id', auth.isInRole('Admin'), controllers.thread.editPost)

  app.get('/post/:id/:name?', auth.isAuthenticated, controllers.thread.detailsGet)
  app.post('/post/:id/:name?', auth.isAuthenticated, controllers.answer.addPost)

  app.get('/answer/edit/:id', auth.isInRole('Admin'), controllers.answer.editGet)
  app.post('/answer/edit/:id', auth.isInRole('Admin'), controllers.answer.editPost)
  app.get('/answer/delete/:id', auth.isInRole('Admin'), controllers.answer.deleteGet)
  app.post('/answer/delete/:id', auth.isInRole('Admin'), controllers.answer.deletePost)

  app.get('/category/add', auth.isInRole('Admin'), controllers.category.addGet)
  app.post('/category/add', auth.isInRole('Admin'), controllers.category.addPost)
  app.get('/category/delete/:id', auth.isInRole('Admin'), controllers.category.delete)
  app.get('/categories', controllers.category.list)
  app.get('/list/:name', controllers.category.getThreadsByCategory)

  app.post('/like/:id', auth.isAuthenticated, controllers.thread.like)
  app.post('/dislike/:id', auth.isAuthenticated, controllers.thread.dislike)

  // app.get('/xxx/add', auth.isInRole('Admin'), controllers.xxx.addGet)
  // app.post('/xxx/add', auth.isInRole('Admin'), controllers.xxx.addPost)
  // app.get('/xxx/all', controllers.cars.all)
  // app.post('/xxx/work/:id', auth.isAuthenticated, controllers.xxx.work)
  // app.post('/xxx/stop/:id', auth.isInRole('Admin'), controllers.xxx.stop)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
