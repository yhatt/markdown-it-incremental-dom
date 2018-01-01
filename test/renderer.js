import assert from 'assert'
import MarkdownIt from 'markdown-it'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItSub from 'markdown-it-sub'
import IncrementalDOM from 'incremental-dom'
import MarkdownItIncrementalDOM from '../src/markdown-it-incremental-dom'

describe('Renderer', () => {
  const md = (opts = {}) => {
    const instance = MarkdownIt(opts).use(
      MarkdownItIncrementalDOM,
      IncrementalDOM
    )

    // returns rendered string by .renderToIncrementalDOM
    instance.idom = (...args) => {
      IncrementalDOM.patch(
        document.body,
        instance.renderToIncrementalDOM(...args)
      )
      return document.body.innerHTML
    }

    // returns rendered string by .renderInlineToIncrementalDOM
    instance.iidom = (...args) => {
      IncrementalDOM.patch(
        document.body,
        instance.renderInlineToIncrementalDOM(...args)
      )
      return document.body.innerHTML
    }

    return instance
  }

  context('with rendering image (tag + attributes)', () => {
    it('renders <img /> with attributes', () => {
      md().idom('![image](src "title")')
      const image = document.querySelector('img')

      assert(image)
      assert(image.getAttribute('src') === 'src')
      assert(image.getAttribute('alt') === 'image')
      assert(image.getAttribute('title') === 'title')
    })
  })

  context('with rendering fence (requires parsing HTML)', () => {
    it('renders parsed HTML correctly', () => {
      md().idom('```javascript\nalert("test")\n```')

      const pre = document.querySelector('pre')
      assert(pre)

      const code = pre.querySelector('code.language-javascript')
      assert(code)
      assert(code.innerHTML.trim() === 'alert("test")')
    })
  })

  context('with code block rendering (overrided rule)', () => {
    it('renders code block correctly', () => {
      md().idom('    <script>\n    alert("test")\n\t</script>')

      const code = document.querySelector('pre > code')
      assert(
        code.innerHTML === '&lt;script&gt;\nalert("test")\n&lt;/script&gt;'
      )
    })
  })

  context('with inline code rendering (overrided rule)', () => {
    it('renders <code> correctly', () => {
      const rendered = md().iidom('This is `<b>Inline</b>` rendering')
      assert(
        rendered === 'This is <code>&lt;b&gt;Inline&lt;/b&gt;</code> rendering'
      )
    })
  })

  context('with rendering hardbreak (overrided rule)', () => {
    it('renders <br> correctly', () => {
      const rendered = md().iidom('hardbreak  \ntest')
      assert(rendered === 'hardbreak<br>test')
    })
  })

  context('with html option', () => {
    const markdown = '<b class="test">test</b>'

    context('with false', () => {
      it('sanitizes HTML tag', () => {
        const rendered = md({ html: false }).idom(markdown)
        assert(rendered === '<p>&lt;b class="test"&gt;test&lt;/b&gt;</p>')
      })
    })

    context('with true', () => {
      it('renders HTML tag', () => {
        const rendered = md({ html: true }).idom(markdown)
        assert(rendered === `<p>${markdown}</p>`)
      })

      it('renders invalid HTML', () => {
        md({ html: true }).idom('<div>inva<lid</div>')
        assert(document.querySelector('div').textContent === 'inva')
      })

      it('renders invalid nesting HTML', () => {
        md({ html: true }).idom('<table>\n<tr\n</table>')
        assert(document.querySelector('table > tr'))
      })
    })
  })

  context('with breaks option', () => {
    const markdown = 'break\ntest'

    context('with false', () => {
      it('ignores breaks', () => {
        md({ breaks: false }).idom(markdown)
        assert(!document.querySelector('br'))
      })
    })

    context('with true', () => {
      it('renders <br> on breaks', () => {
        md({ breaks: true }).idom(markdown)
        assert(document.querySelector('br'))
      })
    })
  })

  context('with other plugins', () => {
    context('when markdown-it-sub is injected (simple plugin)', () => {
      const instance = md().use(MarkdownItSub)

      it('renders <sub> tag correctly', () => {
        const rendered = instance.idom('H~2~O')
        assert(rendered === '<p>H<sub>2</sub>O</p>')
      })
    })

    context(
      'when markdown-it-footnote is injected (overriding renderer rules)',
      () => {
        const instance = md().use(MarkdownItFootnote)
        const markdown = 'Footnote[^1]\n\n[^1]: test'

        it('renders footnote correctly', () => {
          instance.idom(markdown)

          assert(
            document.querySelector('sup.footnote-ref > a#fnref1[href="#fn1"]')
          )
          assert(document.querySelector('hr.footnotes-sep'))
          assert(
            document.querySelector(
              'section.footnotes > ol.footnotes-list > li#fn1.footnote-item'
            )
          )
          assert(
            document.querySelector('#fn1 a.footnote-backref[href="#fnref1"]')
          )
        })
      }
    )
  })
})
