import { escapeHtml } from 'markdown-it/lib/common/utils'
import Renderer from 'markdown-it/lib/renderer'
import { Parser } from 'htmlparser2'

export default function (incrementalDom) {
  const { elementOpen, elementClose, elementVoid, text } = incrementalDom

  const iDOMParser = new Parser({
    onopentag: (name, attrs) => {
      const args = Object.keys(attrs).reduce((prev, k) => prev.concat(k, attrs[k]), [])
      elementOpen(name, '', [], ...args)
    },
    ontext: text,
    onclosetag: elementClose,
  })

  const wrapIncrementalDOM = (html) => {
    if (typeof html === 'function') return html()
    return iDOMParser.parseComplete(html)
  }

  return class extends Renderer {
    renderAttrsToArray(token) {
      if (!token.attrs) return []

      return token.attrs.reduce((prev, attr) =>
        prev.concat(escapeHtml(attr[0]), escapeHtml(attr[1])), [])
    }

    renderInline(tokens, options, env) {
      return () => tokens.forEach((current, i) => {
        const { type } = current

        if (typeof this.rules[type] !== 'undefined') {
          wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this))
        } else {
          this.renderToken(tokens, i, options)()
        }
      })
    }

    renderToken(tokens, idx) {
      return () => {
        const token = tokens[idx]
        if (token.hidden) return

        if (token.nesting === 0) {
          elementVoid(token.tag, '', [], ...this.renderAttrsToArray(token))
        } else if (token.nesting === -1) {
          elementClose(token.tag)
        } else {
          elementOpen(token.tag, '', [], ...this.renderAttrsToArray(token))
        }
      }
    }

    render(tokens, options, env) {
      return () => tokens.forEach((current, i) => {
        const { type } = current

        if (type === 'inline') {
          this.renderInline(current.children, options, env)()
        } else if (typeof this.rules[type] !== 'undefined') {
          wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this))
        } else {
          this.renderToken(tokens, i, options, env)()
        }
      })
    }
  }
}
