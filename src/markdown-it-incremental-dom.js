import renderer from './renderer/renderer'

const markdownIncrementalDOM = function (md = null, baseIncrementalDOM = null) {
  let incrementalDOM = baseIncrementalDOM
  if (this.constructor === markdownIncrementalDOM) incrementalDOM = md

  // Use window.IncrementalDOM in browser
  if (!incrementalDOM && typeof window !== 'undefined') incrementalDOM = window.IncrementalDOM

  const IncrementalDOMrendererClass = renderer(incrementalDOM)
  const incrementalDOMrenderer = new IncrementalDOMrendererClass()

  // When instance would create by `new markdownIncrementalDOM(baseIncrementalDOM)`
  if (this.constructor === markdownIncrementalDOM) return incrementalDOMrenderer

  // When this is called as markdown-it plugin
  md.renderToIncrementalDOM = function (src, env = {}) {
    return incrementalDOMrenderer.render(this.parse(src, env), this.options, env)
  }
  md.renderInlineToIncrementalDOM = function (src, env = {}) {
    return incrementalDOMrenderer.render(this.parseInline(src, env), this.options, env)
  }

  return incrementalDOMrenderer
}

export { markdownIncrementalDOM as default }
