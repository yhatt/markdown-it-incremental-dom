import assert from 'assert'
import markdownIt from 'markdown-it'
import incrementalDOM from 'incremental-dom'
import iDOMRenderer from '../src/markdown-it-incremental-dom'

describe('markdown-it', () => {
  const md = markdownIt().use(iDOMRenderer, incrementalDOM)

  describe('.renderToIncrementalDOM', () => {
    const { renderToIncrementalDOM } = md

    it('is function', () => assert(typeof renderToIncrementalDOM === 'function'))
  })

  describe('.renderInlineToIncrementalDOM', () => {
    const { renderInlineToIncrementalDOM } = md

    it('is function', () => assert(typeof renderInlineToIncrementalDOM === 'function'))
  })
})
