(function(){
  document.addEventListener('DOMContentLoaded', function() {
    var text = document.querySelector('#text')
    var target = document.querySelector('#target')
    var options = document.querySelectorAll('.markdown-options')
    var method = document.querySelector('.markdown-options:checked').value
    var md = markdownit().use(markdownitIncrementalDOM)

    var render = function() {
      if (method === 'incrementalDOM') {
        IncrementalDOM.patch(target, md.renderToIncrementalDOM(text.value))
      } else {
        target.innerHTML = md.render(text.value)
      }
    }

    var initializeRendering = function() {
      text.removeAttribute('disabled')
      text.removeAttribute('placeholder')
      text.addEventListener('input', render)

      Array.prototype.forEach.call(options, function(elm) {
        elm.addEventListener('change', function(e) {
          method = this.value
          render()
        })
      })

      render()
    }

    text.setAttribute('disabled', 'disabled')

    superagent
      .get('./docs.md')
      .set('Content-Type', 'text/plain')
      .then(function(res) {
        text.value = res.text
        initializeRendering()
      }, function(res) {
        text.value = '*Failed initializing docs.*'
        initializeRendering()
      })
  })
})()
