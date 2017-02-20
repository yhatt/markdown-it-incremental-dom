import rendererMixin from './mixins/renderer'

const mixinTo = (base, mixin) =>
  (Object.assign(Object.create(Object.getPrototypeOf(base)), base, mixin))

const processIncrementalDOMArgument = incrementalDOM =>
  ((!incrementalDOM && typeof window !== 'undefined') ? window.IncrementalDOM : incrementalDOM)

export default function (md, target) {
  const incrementalDOM = processIncrementalDOMArgument(target)
  const mixin = rendererMixin(incrementalDOM)

  md.renderToIncrementalDOM = function (src, env = {}) {
    return mixinTo(this.renderer, mixin).render(this.parse(src, env), this.options, env)
  }
  md.renderInlineToIncrementalDOM = function (src, env = {}) {
    return mixinTo(this.renderer, mixin).render(this.parseInline(src, env), this.options, env)
  }
}
