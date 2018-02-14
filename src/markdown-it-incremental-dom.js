import renderer from './mixins/renderer'
import rules from './mixins/rules'

export default function(md, target, opts = {}) {
  const options = { incrementalizeDefaultRules: true, ...opts }
  const incrementalDOM = !target && window ? window.IncrementalDOM : target
  const mixin = renderer(incrementalDOM)

  Object.defineProperty(md, 'IncrementalDOMRenderer', {
    get() {
      const extended = Object.assign(
        Object.create(Object.getPrototypeOf(this.renderer)),
        this.renderer,
        mixin
      )

      if (options.incrementalizeDefaultRules) {
        extended.rules = { ...extended.rules, ...rules(incrementalDOM) }
      }
      return extended
    },
  })

  md.renderToIncrementalDOM = function(src, env = {}) {
    return this.IncrementalDOMRenderer.render(
      this.parse(src, env),
      this.options,
      env
    )
  }

  md.renderInlineToIncrementalDOM = function(src, env = {}) {
    return this.IncrementalDOMRenderer.render(
      this.parseInline(src, env),
      this.options,
      env
    )
  }
}
