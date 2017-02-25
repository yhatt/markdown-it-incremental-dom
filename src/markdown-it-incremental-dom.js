import rendererMixin from './mixins/renderer'
import incrementalizedRules from './mixins/rules'

const mixinTo = (base, mixin) =>
  (Object.assign(Object.create(Object.getPrototypeOf(base)), base, mixin))

const processIncrementalDOMArgument = incrementalDOM =>
  ((!incrementalDOM && typeof window !== 'undefined') ? window.IncrementalDOM : incrementalDOM)

export default function (md, target, opts = {}) {
  const options = Object.assign({ incrementalizeDefaultRules: true }, opts)
  const incrementalDOM = processIncrementalDOMArgument(target)
  const mixin = rendererMixin(incrementalDOM)

  const render = function (method, src, env) {
    const renderer = mixinTo(this.renderer, mixin)

    if (options.incrementalizeDefaultRules) {
      Object.assign(renderer.rules, incrementalizedRules(incrementalDOM))
    }

    return renderer.render(this[method](src, env), this.options, env)
  }

  md.renderToIncrementalDOM = function (src, env = {}) {
    return render.call(this, 'parse', src, env)
  }
  md.renderInlineToIncrementalDOM = function (src, env = {}) {
    return render.call(this, 'parseInline', src, env)
  }
}
