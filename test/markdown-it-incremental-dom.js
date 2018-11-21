import * as IncrementalDOM from 'incremental-dom'
import context from 'jest-plugin-context'
import MarkdownIt from 'markdown-it'
import { Parser } from 'htmlparser2'
import MarkdownItIncrementalDOM from '../src/markdown-it-incremental-dom'

describe('markdown-it-incremental-dom', () => {
  const md = (opts = {}) =>
    MarkdownIt().use(MarkdownItIncrementalDOM, IncrementalDOM, opts)

  describe('markdownIt().use', () => {
    context('when Incremental DOM argument is omitted', () => {
      afterEach(() => delete window.IncrementalDOM)

      it('fails injection if window.IncrementalDOM is not defined', () =>
        expect(() => MarkdownIt().use(MarkdownItIncrementalDOM)).toThrow())

      it('succeeds injection if window.IncrementalDOM is defined', () => {
        window.IncrementalDOM = IncrementalDOM
        expect(() => MarkdownIt().use(MarkdownItIncrementalDOM)).not.toThrow()
      })
    })

    context('with option', () => {
      describe('incrementalizeDefaultRules property', () => {
        let spy

        beforeEach(() => {
          spy = jest.spyOn(Parser.prototype, 'write')
        })
        afterEach(() => spy.mockRestore())

        const mdString = '`code_inline`'
        const expectedHTML = '<code>code_inline</code>'

        context('when it is false', () => {
          it('parses HTML string by htmlparser2', () => {
            const func = md({
              incrementalizeDefaultRules: false,
            }).renderInlineToIncrementalDOM(mdString)

            IncrementalDOM.patch(document.body, func)
            expect(spy).toHaveBeenCalledWith(expectedHTML)
          })
        })

        context('when it is true', () => {
          it('does not parse HTML string in overridden rule', () => {
            const func = md({
              incrementalizeDefaultRules: true,
            }).renderInlineToIncrementalDOM(mdString)

            IncrementalDOM.patch(document.body, func)
            expect(spy).not.toHaveBeenCalledWith(expectedHTML)
          })
        })
      })
    })
  })

  describe('get IncrementalDOMRenderer', () => {
    it('returns IncrementalDOM renderer that is injected into current state', () => {
      const instance = md()
      const { options } = instance
      const tokens = instance.parse('# test')

      instance.renderer.rules.heading_open = () => '['
      instance.renderer.rules.heading_close = () => ']'

      const rendererOne = instance.IncrementalDOMRenderer
      IncrementalDOM.patch(document.body, rendererOne.render(tokens, options))
      expect(document.body.innerHTML).toBe('[test]')

      instance.renderer.rules.heading_open = () => '^'
      instance.renderer.rules.heading_close = () => '$'

      const rendererTwo = instance.IncrementalDOMRenderer
      IncrementalDOM.patch(document.body, rendererTwo.render(tokens, options))
      expect(document.body.innerHTML).toBe('^test$')
    })
  })

  describe('.renderToIncrementalDOM', () => {
    it('returns patchable function by specified Incremental DOM', () => {
      const func = md().renderToIncrementalDOM('markdown-it-incremental-dom')

      IncrementalDOM.patch(document.body, func)
      expect(document.body.innerHTML).toBe('<p>markdown-it-incremental-dom</p>')
    })
  })

  describe('.renderInlineToIncrementalDOM', () => {
    it('returns patchable function by specified Incremental DOM', () => {
      const func = md().renderInlineToIncrementalDOM(
        'markdown-it-incremental-dom'
      )

      IncrementalDOM.patch(document.body, func)
      expect(document.body.innerHTML).toBe('markdown-it-incremental-dom')
    })
  })
})
