const home = require('./home-controller')
const users = require('./users-controller')
const thread = require('./thread-controller')
const category = require('./category-controller')

module.exports = {
  home: home,
  users: users,
  thread: thread,
  category: category
}
