import { jsdom } from 'jsdom'

global.document = jsdom('')
global.window = document.defaultView

Object.keys(global.window)
  .concat(['Document', 'Element'])
  .forEach((prop) => {
    if (typeof global[prop] === 'undefined') {
      global[prop] = global.window[prop]
    }
  })

global.navigator = { userAgent: 'node.js' }
