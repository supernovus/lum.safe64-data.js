# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2024-09-10
### Added
- A new `transcoder` module that contains the base Data64 class,
  and a minimal format profile that *only* supports JSON data.
- Several additional exported profile modules for optimizing bundles:
  - `profiles/php` → `JSON+PHP`
  - `profiles/bin` → `JSON+UBJSON`
  - `profiles/jsx` → `JSON+JSOX`
  - `profiles/default` → `JSON+PHP+UBJSON`
  - `profiles/all` → `JSON+PHP+UBJSON+JSOX`
- A few exports that are simply aliases to other modules:
  - `profiles/core` → `transcoder`
  - `profiles/full` → `profiles/all`
### Changed
- The default `@lumjs/safe64-data` export simply re-exports the
  `profiles/default` module, which supports the same serialization 
  formats as the [PHP] implementation.
- Split the `header` module up to be more modular. 
- While these changes are mostly backwards-compatible, they are a big
  enough change that I'm bumping the major version on this release.

## [1.0.0] - 2024-08-15
### Initial release
- Extracted all `safe64` libraries from `@lumjs/encode` package.
- Refactored it a lot, breaking the old API, but it's a lot better now.

[Unreleased]: https://github.com/supernovus/lum.safe64-data.js/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/supernovus/lum.safe64-data.js/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/supernovus/lum.safe64-data.js/releases/tag/v1.0.0

[PHP]: https://github.com/supernovus/lum.encode.php
