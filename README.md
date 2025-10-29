# gh-actions-lux

GitHub action for installing [lux-cli](https://lux.lumen-labs.org/) bundled with
lux-lua.

## Inputs

### `version`

- Default: `latest`
- Example: `0.18.8`

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
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.18.8

      - name: Use lux-cli
        run: |
          lx --version
```

### Matrix (multiple targets)

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

      - name: Install MSVC Compiler Toolchain
        uses: ilammy/msvc-dev-cmd@v1
        if: endsWith(matrix.job.target, '-msvc')

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.18.8

      - name: Use lux-cli
        run: |
          lx --version
```

### Matrix (multiple targets + Lua versions)

Because Lux can handle installing Lua for you, you do not need a step for
installing Lua.

```yaml
name: Tests
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    name: ${{ matrix.job.target }} - Lua ${{ matrix.lua_version }}
    runs-on: ${{ matrix.job.os }}
    strategy:
      fail-fast: false
      matrix:
        job:
          - { os: ubuntu-24.04, target: x86_64-linux }
          - { os: ubuntu-24.04-arm, target: aarch64-linux }
          - { os: macos-14, target: aarch64-darwin }
          - { os: windows-2025, target: x86_63-windows-msvc }
        lua_version:
          - 5.1
          - 5.2
          - 5.3
          - 5.4
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Install MSVC Compiler Toolchain
        uses: ilammy/msvc-dev-cmd@v1
        if: endsWith(matrix.job.target, '-msvc')

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.18.8

      - name: Run tests
        run: |
          lx --lua-version ${{ matrix.lua_version }} test
```

### Matrix (Neovim plugin)

To test a Neovim plugin that uses the
[`busted-nlua`](https://lux.lumen-labs.org/guides/lux-toml#busted-nlua) test
backend:

```yaml
name: Tests
on:
  pull_request:
  push:
    branches: [main]

  test:
    name: ${{ matrix.job.target }} - Lua ${{ matrix.lua_version }}
    runs-on: ${{ matrix.job.os }}
    strategy:
      fail-fast: false
      matrix:
        job:
          - { os: ubuntu-24.04, target: x86_64-linux }
          - { os: ubuntu-24.04-arm, target: aarch64-linux }
          - { os: macos-14, target: aarch64-darwin }
          - { os: windows-2025, target: x86_63-windows-msvc }
        nvim-version:
          - stable
          - nightly
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Install MSVC Compiler Toolchain
        uses: ilammy/msvc-dev-cmd@v1
        if: endsWith(matrix.job.target, '-msvc')

      - name: Setup Neovim
        uses: rhysd/action-setup-vim@v1
        with:
          neovim: true
          version: ${{ matrix.nvim-version }}

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.18.8

      - name: Run tests
        run: |
          lx --nvim test
```
