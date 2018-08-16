import { stripIndents } from 'common-tags'
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

    // returns rendered string
    const renderWithIncrementalDOM = (func, args) => {
      IncrementalDOM.patch(document.body, func(...args))
      return document.body.innerHTML
    }

    instance.idom = (...args) =>
      renderWithIncrementalDOM(instance.renderToIncrementalDOM, args)

    instance.iidom = (...args) =>
      renderWithIncrementalDOM(instance.renderInlineToIncrementalDOM, args)

    return instance
  }

  const has = q => expect(document.querySelector(q)).toBeTruthy()

  context('with rendering image (tag + attributes)', () => {
    it('renders <img /> with attributes', () => {
      md().idom('![image](src "title")')
      const image = document.querySelector('img')

      expect(image).toBeTruthy()
      expect(image.getAttribute('src')).toBe('src')
      expect(image.getAttribute('alt')).toBe('image')
      expect(image.getAttribute('title')).toBe('title')
    })
  })

  context('with rendering fence (requires parsing HTML)', () => {
    it('renders parsed HTML correctly', () => {
      md().idom('```javascript\nalert("test")\n```')

      const pre = document.querySelector('pre')
      expect(pre).toBeTruthy()

      const code = pre.querySelector('code.language-javascript')
      expect(code).toBeTruthy()
      expect(code.innerHTML.trim()).toBe('alert("test")')
    })
  })

  context('with code block rendering (overrided rule)', () => {
    it('renders code block correctly', () => {
      md().idom('    <script>\n    alert("test")\n\t</script>')

      const { innerHTML } = document.querySelector('pre > code')
      expect(innerHTML).toBe('&lt;script&gt;\nalert("test")\n&lt;/script&gt;')
    })
  })

  context('with inline code rendering (overrided rule)', () =>
    it('renders <code> correctly', () =>
      expect(md().iidom('This is `<b>Inline</b>` rendering')).toBe(
        'This is <code>&lt;b&gt;Inline&lt;/b&gt;</code> rendering'
      ))
  )

  context('with rendering hardbreak (overrided rule)', () =>
    it('renders <br> correctly', () =>
      expect(md().iidom('hardbreak  \ntest')).toBe('hardbreak<br>test'))
  )

  context('with html option', () => {
    const markdown = '<b class="test">test</b>'

    context('with false', () =>
      it('sanitizes HTML tag', () =>
        expect(md({ html: false }).idom(markdown)).toBe(
          '<p>&lt;b class="test"&gt;test&lt;/b&gt;</p>'
        ))
    )

    context('with true', () => {
      it('renders HTML tag', () =>
        expect(md({ html: true }).idom(markdown)).toBe(`<p>${markdown}</p>`))

      it('renders empty element without slash', () => {
        md({ html: true }).idom('<hr><img src="test.png">')
        has('hr + img')
      })

      it('renders invalid HTML', () => {
        md({ html: true }).idom('<div>inva<lid</div>')
        expect(document.querySelector('div').textContent).toBe('inva')
      })

      it('renders invalid nesting HTML', () => {
        md({ html: true }).idom('<table>\n<tr\n</table>')
        has('table > tr')
      })

      it('renders inline SVG', () => {
        const svg = stripIndents`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="gradation" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f00" />
                <stop offset="100%" stop-color="#00f" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="32" height="32" fill="url(#gradation)" />
          </svg>
        `

        md({ html: true }).idom(svg)

        has('svg[xmlns][viewBox="0 0 32 32"]')
        has('svg > defs > linearGradient#gradation')
        has('#gradation > stop + stop')
        has('svg > rect[x][y][width][height][fill]')
      })
    })
  })

  context('with breaks option', () => {
    const markdown = 'break\ntest'

    context('with false', () => {
      it('keeps breaks as text', () => {
        md({ breaks: false }).idom(markdown)

        expect(document.querySelector('br')).toBeFalsy()
        expect(document.querySelector('p').textContent).toBe(markdown)
      })
    })

    context('with true', () => {
      it('renders <br> on breaks', () => {
        md({ breaks: true }).idom(markdown)
        has('br')
      })
    })
  })

  context('with other plugins', () => {
    context('when markdown-it-sub is injected (simple plugin)', () => {
      const instance = md().use(MarkdownItSub)

      it('renders <sub> tag correctly', () =>
        expect(instance.idom('H~2~O')).toBe('<p>H<sub>2</sub>O</p>'))
    })

    context(
      'when markdown-it-footnote is injected (overriding renderer rules)',
      () => {
        const instance = md().use(MarkdownItFootnote)
        const markdown = 'Footnote[^1]\n\n[^1]: test'

        it('renders footnote correctly', () => {
          instance.idom(markdown)

          has('sup.footnote-ref > a#fnref1[href="#fn1"]')
          has('hr.footnotes-sep')
          has('section.footnotes > ol.footnotes-list > li#fn1.footnote-item')
          has('#fn1 a.footnote-backref[href="#fnref1"]')
        })
      }
    )
  })
})
