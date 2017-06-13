const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, auth.isInRole('Admin'), controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/users/me', auth.isAuthenticated, controllers.users.profile)

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
