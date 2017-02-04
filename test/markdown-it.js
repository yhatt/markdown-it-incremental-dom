import assert from 'assert'
import MarkdownIt from 'markdown-it'
import IncrementalDOM from 'incremental-dom'
import MarkdownItIncrementalDOM from '../src/markdown-it-incremental-dom'

describe('markdown-it', () => {
  const md = MarkdownIt().use(MarkdownItIncrementalDOM, IncrementalDOM)

  describe('.renderToIncrementalDOM', () => {
    const { renderToIncrementalDOM } = md

    it('is function', () => assert(typeof renderToIncrementalDOM === 'function'))
  })

  describe('.renderInlineToIncrementalDOM', () => {
    const { renderInlineToIncrementalDOM } = md

    it('is function', () => assert(typeof renderInlineToIncrementalDOM === 'function'))
  })
})
