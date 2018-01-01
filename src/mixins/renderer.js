import { Parser } from 'htmlparser2'

export default function(incrementalDom) {
  const {
    attr,
    elementClose,
    elementOpen,
    elementOpenEnd,
    elementOpenStart,
    elementVoid,
    text,
  } = incrementalDom

  const sanitizeName = name => name.replace(/[^-:\w]/g, '')

  const iDOMParser = new Parser(
    {
      onopentag: name => elementOpenEnd(sanitizeName(name)),
      onopentagname: name => elementOpenStart(sanitizeName(name), '', []),
      onattribute: (name, value) => {
        const sanitizedName = sanitizeName(name)
        if (sanitizedName !== '') attr(sanitizedName, value)
      },
      ontext: text,
      onclosetag: name => elementClose(sanitizeName(name)),
    },
    {
      decodeEntities: true,
      xmlMode: true,
    }
  )

  const wrapIncrementalDOM = html =>
    typeof html === 'function' ? html() : iDOMParser.write(html)

  return {
    renderAttrsToArray(token) {
      if (!token.attrs) return []
      return token.attrs.reduce((v, a) => v.concat(a), [])
    },

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
          elementVoid(token.tag, '', [], ...this.renderAttrsToArray(token))
        } else if (token.nesting === -1) {
          elementClose(token.tag)
        } else {
          elementOpen(token.tag, '', [], ...this.renderAttrsToArray(token))
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
