import renderer from './renderer/renderer'

const incrementalDOMRendererPlugin = (md, baseIncrementalDOM = null) => {
  const incrementalDOM = baseIncrementalDOM || global.IncrementalDOM
  const IncrementalDOMrendererClass = renderer(incrementalDOM)
  const incrementalDOMrenderer = new IncrementalDOMrendererClass()

  md.renderToIncrementalDOM = function (src, env = {}) {
    return incrementalDOMrenderer.render(this.parse(src, env), this.options, env)
  }
  md.renderInlineToIncrementalDOM = function (src, env = {}) {
    return incrementalDOMrenderer.render(this.parseInline(src, env), this.options, env)
  }
}

export {
  incrementalDOMRendererPlugin as default,
  renderer,
}
