import { Parser } from 'htmlparser2'
import { escapeHtml } from 'markdown-it/lib/common/utils'
import flatten from 'lodash/flatten'
import toPairs from 'lodash/toPairs'

export default function (incrementalDom) {
  const { elementOpen, elementClose, elementVoid, text } = incrementalDom

  const iDOMParser = new Parser({
    onopentag: (name, attrs) => elementOpen(name, '', [], ...flatten(toPairs(attrs))),
    ontext: text,
    onclosetag: elementClose,
  }, { decodeEntities: true })

  const attrsToArray = token => (token.attrs ? flatten(token.attrs).map(v => escapeHtml(v)) : [])
  const wrapIncrementalDOM = html => ((typeof html === 'function') ? html() : iDOMParser.write(html))

  return {
    renderInline(tokens, options, env) {
      return ({ preventEndHTMLParser } = { preventEndHTMLParser: false }) => {
        tokens.forEach((current, i) => {
          const { type } = current

          if (typeof this.rules[type] !== 'undefined') {
            wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this))
          } else {
            this.renderToken(tokens, i, options)()
          }
        })
        if (!preventEndHTMLParser) {
          iDOMParser.end()
          iDOMParser.reset()
        }
      }
    },

    renderToken(tokens, idx) {
      return () => {
        const token = tokens[idx]
        if (token.hidden) return

        if (token.nesting === 0) {
          elementVoid(token.tag, '', [], ...attrsToArray(token))
        } else if (token.nesting === -1) {
          elementClose(token.tag)
        } else {
          elementOpen(token.tag, '', [], ...attrsToArray(token))
        }
      }
    },

    render(tokens, options, env) {
      return () => {
        tokens.forEach((current, i) => {
          const { type } = current

          if (type === 'inline') {
            this.renderInline(current.children, options, env)({ preventEndHTMLParser: true })
          } else if (typeof this.rules[type] !== 'undefined') {
            wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this))
          } else {
            this.renderToken(tokens, i, options, env)()
          }
        })
        iDOMParser.end()
        iDOMParser.reset()
      }
    },
  }
}
