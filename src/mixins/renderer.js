import { Parser } from 'htmlparser2'

export default function (incrementalDom) {
  const {
    attr,
    elementClose,
    elementOpen,
    elementOpenEnd,
    elementOpenStart,
    elementVoid,
    text,
  } = incrementalDom

  const iDOMParser = new Parser({
    onopentag: elementOpenEnd,
    onopentagname: name => elementOpenStart(name, '', []),
    onattribute: attr,
    ontext: text,
    onclosetag: elementClose,
  }, { decodeEntities: true })

  const attrsToArray = (token) => {
    if (!token.attrs) return []
    return token.attrs.reduce((v, a) => v.concat(a), [])
  }
  const wrapIncrementalDOM = html => ((typeof html === 'function') ? html() : iDOMParser.write(html))

  return {
    renderInline(tokens, options, env) {
      return () => {
        tokens.forEach((current, i) => {
          const { type } = current

          if (typeof this.rules[type] !== 'undefined') {
            wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this))
          } else {
            this.renderToken(tokens, i, options)()
          }
        })
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
            this.renderInline(current.children, options, env)()
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
