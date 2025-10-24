import { mapGithubReleaseToLuxRelease } from '../src/lux.js'
import type { GitHubRelease } from '../src/github.js'

describe('mapGithubReleaseToLuxRelease', () => {
  test('maps a GitHub release with installer assets and digests to LuxRelease', () => {
    const ghRelease: GitHubRelease = {
      tag_name: 'v1.0.0',
      assets: [
        {
          name: 'lx_1.0.0_amd64.deb',
          browser_download_url: 'https://example.com/lx_1.0.0_amd64.deb',
          digest:
            'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
        },
        {
          name: 'lx_1.0.0_arm64.deb',
          browser_download_url: 'https://example.com/lx_1.0.0_arm64.deb',
          digest:
            'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        {
          name: 'lux-cli_1.0.0_aarch64.dmg',
          browser_download_url: 'https://example.com/lux-cli_1.0.0_aarch64.dmg',
          digest:
            'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
        },
        {
          name: 'lx_1.0.0_x64-setup.exe',
          browser_download_url: 'https://example.com/lx_1.0.0_x64-setup.exe',
          digest:
            'sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        }
      ]
    }

    const lux_release = mapGithubReleaseToLuxRelease(ghRelease)

    expect(lux_release.version).toBe('1.0.0')
    expect(lux_release.assets).toHaveLength(4)

    const byName = new Map(lux_release.assets.map((a) => [a.file_name, a]))
    expect(byName.get('lx_1.0.0_amd64.deb')!.download_url).toBe(
      'https://example.com/lx_1.0.0_amd64.deb'
    )
    expect(byName.get('lx_1.0.0_amd64.deb')!.sha256sum).toBe(
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    )

    expect(byName.get('lx_1.0.0_arm64.deb')!.sha256sum).toBe(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    )
    expect(byName.get('lux-cli_1.0.0_aarch64.dmg')!.sha256sum).toBe(
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    )
    expect(byName.get('lx_1.0.0_x64-setup.exe')!.sha256sum).toBe(
      'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
    )
  })

  test('skips missing installer assets and only returns available ones', () => {
    const ghRelease: GitHubRelease = {
      tag_name: 'v2.0.0',
      assets: [
        {
          name: 'lx_2.0.0_amd64.deb',
          browser_download_url: 'https://example.com/lx_2.0.0_amd64.deb',
          digest:
            'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
        }
        // other platforms not provided
      ]
    }

    const lux_release = mapGithubReleaseToLuxRelease(ghRelease)
    expect(lux_release.version).toBe('2.0.0')
    expect(lux_release.assets).toHaveLength(1)
    expect(lux_release.assets[0].file_name).toBe('lx_2.0.0_amd64.deb')
  })

  test('throws when an installer asset is present but missing digest', () => {
    const ghRelease: GitHubRelease = {
      tag_name: 'v3.0.0',
      assets: [
        {
          name: 'lx_3.0.0_amd64.deb',
          browser_download_url: 'https://example.com/lx_3.0.0_amd64.deb'
          // missing digest
        }
      ]
    }

    expect(() => mapGithubReleaseToLuxRelease(ghRelease)).toThrow()
  })

  test('throws when release has no tag_name or name', () => {
    const ghRelease: GitHubRelease = {
      assets: []
    }
    expect(() => mapGithubReleaseToLuxRelease(ghRelease)).toThrow()
  })
})
