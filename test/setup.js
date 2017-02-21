import { jsdom } from 'jsdom'

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((prop) => {
  if (typeof global[prop] === 'undefined') {
    global[prop] = document.defaultView[prop]
  }
})

global.navigator = { userAgent: 'node.js' }
