import { escapeHtml } from 'markdown-it/lib/common/utils'
import Renderer from 'markdown-it/lib/renderer'

export default function (incrementalDom) {
  const { elementOpen, elementClose, elementVoid, text } = incrementalDom

  return class extends Renderer {
    constructor() {
      super()
      this.rules.text = (tokens, idx) => { text(escapeHtml(tokens[idx].content)) }
    }

    renderAttrs(token) {
      if (!token.attrs) return null

      return token.attrs.reduce(
        (prev, attr) => prev.push(escapeHtml(attr[0]), escapeHtml(attr[1])),
        [],
      )
    }

    renderToken(tokens, idx) {
      const token = tokens[idx]
      if (token.hidden) return

      if (token.nesting === 0) {
        elementVoid(token.tag, '', this.renderAttrs(token))
      } else if (token.nesting === -1) {
        elementClose(token.tag)
      } else {
        elementOpen(token.tag, '', this.renderAttrs(token))
      }
    }

    render(tokens, options, env) {
      return () => super.render(tokens, options, env)
    }
  }
}
