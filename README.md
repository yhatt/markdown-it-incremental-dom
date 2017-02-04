# markdown-it-incremental-dom

A [markdown-it](https://github.com/markdown-it/markdown-it) renderer plugin for using [Incremental DOM](https://github.com/google/incremental-dom).

## Requirement

- [markdown-it](https://github.com/markdown-it/markdown-it) >= 4.0.0 (Recommend latest version >= 8.2.2, that this plugin use it)
- [Incremental DOM](https://github.com/google/incremental-dom) >= 0.5.x

## Usage

```javascript
const IncrementalDOM = require('incremental-dom')

const md = require('markdown-it')()
             .use(require('markdown-it-incremental-dom'), IncrementalDOM)

IncrementalDOM.patch(
  document.getElementById('target'),
  md.renderToIncrementalDOM('# Hello, Incremental DOM!')
)
```

### As a renderer (for expert)

```javascript
const IncrementalDOM = require('incremental-dom')

const MarkdownItIncrementalDOM = require('markdown-it-incremental-dom')
const incrementalDOMRenderer = new MarkdownItIncrementalDOM(IncrementalDOM)

const md = require('markdown-it')()
const tokens = md.parse('# Hello, Incremental DOM!')

const patchFunc = incrementalDOMRenderer.render(tokens)
IncrementalDOM.patch(document.getElementById('target'), patchFunc)
```

## API

## Author

Yuki Hattori ([@yhatt](https://github.com/yhatt/))
