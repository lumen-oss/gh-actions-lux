# gh-actions-lux

GitHub action for installing [lux-cli](https://lux.lumen-labs.org/) bundled with
lux-lua.

Feel free to consult the
[documentation](https://lux.lumen-labs.org/tutorial/getting-started) on how to
get started with Lux! It features a tutorial and several guides to make you good
at managing Lua projects.

## Inputs

### `version`

- Default: `latest`
- Example: `0.20.3`

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
          version: 0.20.3

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
          version: 0.20.3

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
          version: 0.20.3

      - name: Type checks
        run: |
          lx --lua-version ${{ matrix.lua_version }} check --warnings-as-errors

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
jobs:
  test:
    name: ${{ matrix.job.target }} - Lua ${{ matrix.nvim-version }}
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
          version: 0.20.3

      - name: Type checks
        run: |
          lx --nvim check --warnings-as-errors
        env:
          # See the .luarc.json below
          VIMRUNTIME:
            /home/runner/nvim-${{ matrix.nvim-version }}/share/nvim/runtime

      - name: Run tests
        run: |
          lx --nvim test
```

With the following `.luarc.json`:

```json
{
  "diagnostics": {
    "enable": true
  },
  "runtime": {
    "version": "Lua 5.1"
  },
  "workspace": {
    "library": ["$VIMRUNTIME"]
  }
}
```

> [!NOTE]
>
> `lx check` will automatically add dependencies to your `.luarc.json`'s
> `workspace.library`.

### Uploading a package to luarocks.org

To use `lx upload`, you need to provide an API key for luarocks.org.

> [!TIP]
>
> We recommend combining this workflow with
> [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and
> [release-please](https://github.com/googleapis/release-please-action).

#### With artifact signing enabled (recommended)

First, [generate a GPG key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key)
and export the private key to your clipboard:

```bash
# Ubuntu (assuming GNU base64)
gpg --armor --export-secret-key joe@foo.bar -w0 | xclip

# Arch Linux
gpg --armor --export-secret-key joe@foo.bar | xclip -selection clipboard -i

# macOS
gpg --armor --export-secret-key joe@foo.bar | pbcopy

# FreeBSD (assuming BSD base64)
gpg --armor --export-secret-key joe@foo.bar | xclip
```

Then, add the key to your [repository's secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).
Create another secret with the `GPG_PASSPHRASE` if applicable.

```yaml
name: Lux upload
on:
  push:
    tags: # Will upload to luarocks.org when a tag is pushed
      - '*'
  workflow_dispatch:
jobs:
  luarocks-upload:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Import GPG key
        uses: crazy-max/ghaction-import-gpg@v6
        with:
          gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: ${{ secrets.GPG_PASSPHRASE }}

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.20.3

      - name: Upload
        run: |
          lx upload
        env:
          LUX_API_KEY: ${{ secrets.LUX_API_KEY }}
```

#### With artifact signing disabled

```yaml
name: Lux upload
on:
  push:
    tags: # Will upload to luarocks.org when a tag is pushed
      - '*'
  workflow_dispatch:
jobs:
  luarocks-upload:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Install Lux
        uses: lumen-oss/gh-actions-lux@v1
        with:
          version: 0.20.3

      - name: Upload
        run: |
          lx upload --sign-protocol none
        env:
          LUX_API_KEY: ${{ secrets.LUX_API_KEY }}
```
