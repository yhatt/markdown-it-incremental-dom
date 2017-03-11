import assert from 'assert'
import sinon from 'sinon'
import IncrementalDOM from 'incremental-dom'
import MarkdownIt from 'markdown-it'
import { Parser } from 'htmlparser2'
import MarkdownItIncrementalDOM from '../src/markdown-it-incremental-dom'

describe('markdown-it-incremental-dom', () => {
  const md = (opts = {}) => MarkdownIt().use(MarkdownItIncrementalDOM, IncrementalDOM, opts)

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

    context('with option', () => {
      describe('incrementalizeDefaultRules property', () => {
        let spy

        beforeEach(() => { spy = sinon.spy(Parser.prototype, 'write') })
        afterEach(() => spy.restore())

        const mdString = '`code_inline`'
        const expectedHTML = '<code>code_inline</code>'

        context('when it is false', () => {
          it('parses HTML string by htmlparser2', () => {
            const func = md({ incrementalizeDefaultRules: false }).renderInlineToIncrementalDOM(mdString)

            IncrementalDOM.patch(document.body, func)
            assert(spy.calledWith(expectedHTML))
          })
        })

        context('when it is true', () => {
          it('does not parse HTML string in overridden rule', () => {
            const func = md({ incrementalizeDefaultRules: true }).renderInlineToIncrementalDOM(mdString)

            IncrementalDOM.patch(document.body, func)
            assert(!spy.calledWith(expectedHTML))
          })
        })
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
