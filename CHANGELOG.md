Change Log
===

[Unreleased]
---

### Changed

- Upgrade dependencies to latest version ([#12](https://github.com/yhatt/markdown-it-incremental-dom/pull/12))
- Use babel-preset-env + polyfill instead of babel-preset-es2015 ([#13](https://github.com/yhatt/markdown-it-incremental-dom/pull/13))

### Fixed

- Fix double executing pre-publish script in `npm publish` executed by `^npm@4.0.0` ([#11](https://github.com/yhatt/markdown-it-incremental-dom/pull/11))

v1.0.0 - 2017-03-14
---

### Added

- For browser: Add banner to show license ([#9](https://github.com/yhatt/markdown-it-incremental-dom/pull/9))
- For browser: Provide uncompressed version ([#9](https://github.com/yhatt/markdown-it-incremental-dom/pull/9))
- Override markdown-it's default renderer rules by incrementalized functions for better performance ([#7](https://github.com/yhatt/markdown-it-incremental-dom/pull/7))
- Option argument on initialize that supported `incrementalizeDefaultRules` ([#7](https://github.com/yhatt/markdown-it-incremental-dom/pull/7))
- Badges on README.md: Coverage (powered by Coveralls), npm version, and LICENSE ([#6](https://github.com/yhatt/markdown-it-incremental-dom/pull/6))
- [Demo page](https://yhatt.github.io/markdown-it-incremental-dom/) with explaining of key features  ([#3](https://github.com/yhatt/markdown-it-incremental-dom/issue/3))

v0.1.0 - 2017-02-22
---

- Initial release.
