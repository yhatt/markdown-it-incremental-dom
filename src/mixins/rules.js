export default function(incrementalDom) {
  const { elementClose, elementOpen, elementVoid, text } = incrementalDom

  return {
    code_inline(tokens, idx, options, env, slf) {
      return () => {
        elementOpen('code', '', [], ...slf.renderAttrsToArray(tokens[idx]))
        text(tokens[idx].content)
        elementClose('code')
      }
    },

    code_block(tokens, idx, options, env, slf) {
      return () => {
        elementOpen('pre', '', [], ...slf.renderAttrsToArray(tokens[idx]))
        elementOpen('code')
        text(tokens[idx].content)
        elementClose('code')
        elementClose('pre')
      }
    },

    hardbreak() {
      return () => elementVoid('br')
    },

    softbreak(tokens, idx, options) {
      return () => (options.breaks ? elementVoid('br') : text('\n'))
    },

    text(tokens, idx) {
      return () => text(tokens[idx].content)
    },
  }
}
