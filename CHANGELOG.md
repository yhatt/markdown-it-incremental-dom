# Change Log

## [Unreleased]

* Upgrade Babel to v7 beta ([#23](https://github.com/yhatt/markdown-it-incremental-dom/pull/23))

## v1.1.2 - 2018-01-11

### Fixed

* Reduce bundle size of built for browser ([#22](https://github.com/yhatt/markdown-it-incremental-dom/pull/22))

## v1.1.1 - 2018-01-06

### Fixed

* Sanitize HTML element name and attributes to avoid occurring errors while rendering invalid HTML ([#18](https://github.com/yhatt/markdown-it-incremental-dom/pull/18))

### Changed

* Upgrade dependencies to latest version ([#12](https://github.com/yhatt/markdown-it-incremental-dom/pull/12))
* Upgrade node version to v8.9.3 LTS ([#16](https://github.com/yhatt/markdown-it-incremental-dom/pull/16))
* Use babel-preset-env + polyfill instead of babel-preset-es2015 ([#13](https://github.com/yhatt/markdown-it-incremental-dom/pull/13))
* Add `incremental-dom >=0.5.0` to peerDependencies ([#15](https://github.com/yhatt/markdown-it-incremental-dom/pull/15))
* Format source code by prettier ([#17](https://github.com/yhatt/markdown-it-incremental-dom/pull/17))

## v1.0.0 - 2017-03-14

### Added

* For browser: Add banner to show license ([#9](https://github.com/yhatt/markdown-it-incremental-dom/pull/9))
* For browser: Provide uncompressed version ([#9](https://github.com/yhatt/markdown-it-incremental-dom/pull/9))
* Override markdown-it's default renderer rules by incrementalized functions for better performance ([#7](https://github.com/yhatt/markdown-it-incremental-dom/pull/7))
* Option argument on initialize that supported `incrementalizeDefaultRules` ([#7](https://github.com/yhatt/markdown-it-incremental-dom/pull/7))
* Badges on README.md: Coverage (powered by Coveralls), npm version, and LICENSE ([#6](https://github.com/yhatt/markdown-it-incremental-dom/pull/6))
* [Demo page](https://yhatt.github.io/markdown-it-incremental-dom/) with explaining of key features ([#3](https://github.com/yhatt/markdown-it-incremental-dom/issue/3))

## v0.1.0 - 2017-02-22

* Initial release.
