;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const md = markdownit().use(markdownitIncrementalDOM)

    const text = document.querySelector('#text')
    const target = document.querySelector('#target')
    const options = document.querySelectorAll('.markdown-options')
    let method = document.querySelector('.markdown-options:checked').value

    const render = function() {
      if (method === 'incrementalDOM') {
        IncrementalDOM.patch(target, md.renderToIncrementalDOM(text.value))
      } else {
        target.innerHTML = md.render(text.value)
      }
    }

    const initializeRendering = function() {
      text.removeAttribute('disabled')
      text.removeAttribute('placeholder')
      text.addEventListener('input', render)

      Array.prototype.forEach.call(options, elm => {
        elm.addEventListener('change', function onChange() {
          method = this.value
          render()
        })
      })

      render()
    }

    text.setAttribute('disabled', 'disabled')

    fetch('./docs.md', { headers: { 'Content-Type': 'text/plain' } })
      .then(res => res.text())
      .then(t => {
        text.value = t
        initializeRendering()
      })
      .catch(() => {
        text.value = '*Failed initializing docs.*'
        initializeRendering()
      })
  })
})()
