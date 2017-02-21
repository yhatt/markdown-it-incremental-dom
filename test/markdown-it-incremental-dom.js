import assert from 'assert'
import MarkdownIt from 'markdown-it'
import IncrementalDOM from 'incremental-dom'
import MarkdownItIncrementalDOM from '../src/markdown-it-incremental-dom'

describe('markdown-it-incremental-dom', () => {
  const md = () => MarkdownIt().use(MarkdownItIncrementalDOM, IncrementalDOM)

  describe('markdownIt().use', () => {
    context('when Incremental DOM argument is omitted', () => {
      afterEach(() => { delete window.IncrementalDOM })

      it('fails injection if window.IncrementalDOM is not defined', () => {
        assert.throws(() => MarkdownIt().use(MarkdownItIncrementalDOM))
      })

      it('succeeds injection if window.IncrementalDOM is defined', () => {
        window = { IncrementalDOM }
        assert.doesNotThrow(() => MarkdownIt().use(MarkdownItIncrementalDOM))
      })
    })
  })

  describe('.renderToIncrementalDOM', () => {
    it('returns patchable function by specified Incremental DOM', () => {
      const func = md().renderToIncrementalDOM('markdown-it-incremental-dom')

      IncrementalDOM.patch(document.body, func)
      assert(document.body.innerHTML === '<p>markdown-it-incremental-dom</p>')
    })
  })

  describe('.renderInlineToIncrementalDOM', () => {
    it('returns patchable function by specified Incremental DOM', () => {
      const func = md().renderInlineToIncrementalDOM('markdown-it-incremental-dom')

      IncrementalDOM.patch(document.body, func)
      assert(document.body.innerHTML === 'markdown-it-incremental-dom')
    })
  })
})
