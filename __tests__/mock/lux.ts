import { LuxRelease } from '../../src/lux'
import { LuxProvider } from '../../src/ports'

export class MockLuxProvider implements LuxProvider {
  async getRelease(rawVersion: string): Promise<LuxRelease> {
    const version =
      !rawVersion || rawVersion === 'latest'
        ? '1.0.0'
        : String(rawVersion).replace(/^v/, '')
    const checksumA =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const checksumB =
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const checksumC =
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    const checksumD =
      'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'

    const assets = [
      {
        file_name: `lx_${version}_amd64.deb`,
        download_url: `https://example.com/lx_${version}_amd64.deb`,
        sha256sum: checksumA
      },
      {
        file_name: `lx_${version}_arm64.deb`,
        download_url: `https://example.com/lx_${version}_arm64.deb`,
        sha256sum: checksumB
      },
      {
        file_name: `lux-cli_${version}_aarch64.dmg`,
        download_url: `https://example.com/lux-cli_${version}_aarch64.dmg`,
        sha256sum: checksumC
      },
      {
        file_name: `lx_${version}_x64-setup.exe`,
        download_url: `https://example.com/lx_${version}_x64-setup.exe`,
        sha256sum: checksumD
      }
    ]

    return new LuxRelease(version, assets)
  }
}
