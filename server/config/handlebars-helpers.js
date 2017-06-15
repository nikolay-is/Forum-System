const Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1.toString() === v2.toString()) {
    // console.log('Bingo')
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('selected', function (option, value) {
  if (option === value) {
    return ' selected'
  } else {
    return ''
  }
})
// {{#ifCond v1 v2}}
//     {{v1}} is equal to {{v2}}
// {{else}}
//     {{v1}} is not equal to {{v2}}
// {{/ifCond}}

// {/*<select>
// {{#select "Bar"}}
// <option value="">Select an option</option>
// <option value="Foo">Foo</option>
// <option value="Bar">Bar</option>
// {{/select}}
// </select>*/}
