# gh-actions-lux

GitHub action for installing [lux-cli](https://lux.lumen-labs.org/) bundled with
lux-lua.

## Inputs

### `version`

- Default: `latest`
- Example: `0.18.7`

> [!IMPORTANT]
>
> Lux, while generally functional, is a work in progress and does not have a
> `1.0` release yet. For this reason, we recommend pinning the version. Please
> check the [latest release](https://github.com/lumen-oss/lux/releases/latest),
> as the examples in this readme may be outdated.

## Examples

### Minimal setup

```yaml
name: Lux
on:
  pull_request:
  push:
    branches: [main]

jobs:
  lux-action:
    name: Example
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux
        with:
          version: 0.18.7
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Use lux-cli
        run: |
          lx --version
        shell: bash
```

### In a matrix

```yaml
name: Lux
on:
  pull_request:
  push:
    branches: [main]

jobs:
  lux-action:
    name: ${{ matrix.job.target }}
    runs-on: ${{ matrix.job.os }}
    strategy:
      fail-fast: false
      matrix:
        job:
          - { os: ubuntu-24.04, target: x86_64-linux }
          - { os: ubuntu-24.04-arm, target: aarch64-linux }
          - { os: macos-14, target: aarch64-darwin }
          - { os: windows-2025, target: x86_63-windows-msvc }
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux
        with:
          version: 0.18.7
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Use lux-cli
        run: |
          lx --version
        shell: bash
```
