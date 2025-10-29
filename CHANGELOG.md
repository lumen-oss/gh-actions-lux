# Changelog

## [1.0.1](https://github.com/lumen-oss/gh-actions-lux/compare/v1.0.0...v1.0.1) (2025-10-29)

### Bug Fixes

- name in action.yml
  ([bcb7a4a](https://github.com/lumen-oss/gh-actions-lux/commit/bcb7a4a64c0cb408cfeec378e3839c5737597944))

## 1.0.0 (2025-10-29)

### Features

- add action.yml skeleton
  ([8b217c6](https://github.com/lumen-oss/gh-actions-lux/commit/8b217c6772812a0347c21333f289768acda89810))
- cache .lux and lua install directories
  ([#6](https://github.com/lumen-oss/gh-actions-lux/issues/6))
  ([86884a5](https://github.com/lumen-oss/gh-actions-lux/commit/86884a5ac7bcb10609dc096e05c4a5caa07d1680))
- cache downloads ([#5](https://github.com/lumen-oss/gh-actions-lux/issues/5))
  ([637ceb5](https://github.com/lumen-oss/gh-actions-lux/commit/637ceb5e7408c76392cdf8c25c6205036b163f2e))
- download Lux installer + verify checksum
  ([b31c213](https://github.com/lumen-oss/gh-actions-lux/commit/b31c213ebdb859cdbb46447f1a7ab5cb6e6f7b1b))
- env interface for system and architecture
  ([506f90d](https://github.com/lumen-oss/gh-actions-lux/commit/506f90dcf7ea724b77dfe29d1fc8d95a6464ae3f))
- get installer download url
  ([3c3cde3](https://github.com/lumen-oss/gh-actions-lux/commit/3c3cde3ed0e88b07fae2cc3af6e48c9bc6ef9117))
- initial installer implementations
  ([3bff761](https://github.com/lumen-oss/gh-actions-lux/commit/3bff761699f6b3fa29391cd97f2b72b2f98a608f))
- input parsing
  ([4459615](https://github.com/lumen-oss/gh-actions-lux/commit/44596155e7bbd021f64035b6f5641d75f2d3deb8))
- **logs:** add a Done message
  ([138b800](https://github.com/lumen-oss/gh-actions-lux/commit/138b800200850b52805f98b74cdc6e0a58158bcd))
- methods for querying Lux release assets
  ([1f9f4e4](https://github.com/lumen-oss/gh-actions-lux/commit/1f9f4e443caf7e3e6242496c138987671a83f39d))
- more robust json response verification
  ([f7092b9](https://github.com/lumen-oss/gh-actions-lux/commit/f7092b9462665b460c5f90153f07a15e14df95ca))
- pass token via input
  ([a72c431](https://github.com/lumen-oss/gh-actions-lux/commit/a72c4313d52304b088987a00e318c49a1e546284))
- provider for fetching the latest Lux version
  ([f77c750](https://github.com/lumen-oss/gh-actions-lux/commit/f77c750e00babdf7175b9f270dfcbd2c5cf85eaa))
- remvove bad .gitignore entries and add missing src
  ([33d521b](https://github.com/lumen-oss/gh-actions-lux/commit/33d521bba5aa5ee7194a8d3e3e2319999f5e9963))

### Bug Fixes

- **adapter:** return `undefined` if input is undefined
  ([3a78256](https://github.com/lumen-oss/gh-actions-lux/commit/3a78256bb0177ed2b359b7494d6adcd7e6ca64d7))
- add missing await
  ([ad403d1](https://github.com/lumen-oss/gh-actions-lux/commit/ad403d11b87b854bc9ccfb6703291344c2871d9f))
- await install step
  ([fbf03db](https://github.com/lumen-oss/gh-actions-lux/commit/fbf03db3182e0e0a09639879ea751a023e2a5d8e))
- **macos:** installer
  ([b145624](https://github.com/lumen-oss/gh-actions-lux/commit/b145624049d3e0b6ed9750b499dddc2417211b3a))
- set failed on any error
  ([e09195d](https://github.com/lumen-oss/gh-actions-lux/commit/e09195d7d020d937d9bbd2122ef0b6e919bf7664))
- **windows:** add Lux to PATH after installation
  ([2342d9f](https://github.com/lumen-oss/gh-actions-lux/commit/2342d9fa17a7f1d376fbea63f23b7f0afa239982))
