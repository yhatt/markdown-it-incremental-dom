import renderer from './mixins/renderer'
import rules from './mixins/rules'

export default function(md, target, opts = {}) {
  const options = { incrementalizeDefaultRules: true, ...opts }
  const incrementalDOM = !target && window ? window.IncrementalDOM : target
  const mixin = renderer(incrementalDOM)

  const render = function(method, src, env) {
    const extendedRenderer = Object.assign(
      Object.create(Object.getPrototypeOf(this.renderer)),
      this.renderer,
      mixin
    )

    if (options.incrementalizeDefaultRules) {
      extendedRenderer.rules = {
        ...extendedRenderer.rules,
        ...rules(incrementalDOM),
      }
    }

    return extendedRenderer.render(this[method](src, env), this.options, env)
  }

  md.renderToIncrementalDOM = function(src, env = {}) {
    return render.call(this, 'parse', src, env)
  }
  md.renderInlineToIncrementalDOM = function(src, env = {}) {
    return render.call(this, 'parseInline', src, env)
  }
}
