import Renderer from 'markdown-it/lib/renderer'
import rendererMixin from './mixins/renderer'

const mixinTo = (base, mixin) =>
  (Object.assign(Object.create(Object.getPrototypeOf(base)), base, mixin))

const injectMarkdownItIncrementalDOM = (md, incrementalDOM) => {
  const mixin = rendererMixin(incrementalDOM)

  md.renderToIncrementalDOM = function (src, env = {}) {
    return mixinTo(this.renderer, mixin).render(this.parse(src, env), this.options, env)
  }
  md.renderInlineToIncrementalDOM = function (src, env = {}) {
    return mixinTo(this.renderer, mixin).render(this.parseInline(src, env), this.options, env)
  }
}

const processIncrementalDOMArgument = incrementalDOM =>
  ((!incrementalDOM && typeof window !== 'undefined') ? window.IncrementalDOM : incrementalDOM)

const markdownitIncrementalDOM = function (...args) {
  // new markdownitIncrementalDOM(baseIncrementalDOM)
  if (this.constructor === markdownitIncrementalDOM) {
    return mixinTo(new Renderer(), rendererMixin(processIncrementalDOMArgument(args[0])))
  }

  // MarkdownIt().use(markdownitIncrementalDOM, baseIncrementalDOM)
  return injectMarkdownItIncrementalDOM(args[0], processIncrementalDOMArgument(args[1]))
}

export { markdownitIncrementalDOM as default }
