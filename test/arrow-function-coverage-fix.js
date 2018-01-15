// Restore old babylon behavior for istanbul.
// (Temporally fix function coverage on Babel 7)
// https://github.com/babel/babel/pull/6836
// https://github.com/istanbuljs/istanbuljs/issues/119
// @see https://github.com/istanbuljs/istanbuljs/issues/119#issuecomment-356131001
module.exports = function hacks() {
  return {
    visitor: {
      Program(programPath) {
        programPath.traverse({
          ArrowFunctionExpression(path) {
            const node = path.node
            node.expression = node.body.type !== 'BlockStatement'
          },
        })
      },
    },
  }
}
