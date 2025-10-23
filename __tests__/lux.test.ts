import { getInstallerDownloadUrl } from '../src/lux'
import { Env, LuxProvider, Target } from '../src/ports'

const goodProvider = (): LuxProvider => ({
  async latestLuxRelease() {
    return { tag_name: 'v1.0.0', name: 'v1.0.0' }
  }
})

const badProvider = (): LuxProvider => ({
  async latestLuxRelease() {
    return { tag_name: 123 } as unknown as Record<string, unknown>
  }
})

const mkEnv = (versionInput: string | undefined, target: Target): Env => ({
  getVersionInput: () => versionInput,
  getTarget: () => target,
  debug: () => {},
  info: () => {},
  setFailed: () => {}
})

const cases: Array<[Target, string, string]> = [
  ['aarch64-macos', 'lux-cli_0.18.3_aarch64.dmg', 'lux-cli_1.0.0_aarch64.dmg'],
  ['x86_64-linux', 'lx_0.18.3_amd64.deb', 'lx_1.0.0_amd64.deb'],
  ['aarch64-linux', 'lx_0.18.3_arm64.deb', 'lx_1.0.0_arm64.deb'],
  ['x86_64-windows', 'lx_0.18.3_x64-setup.exe', 'lx_1.0.0_x64-setup.exe']
]

describe('getInstallerDownloadUrl (env + provider)', () => {
  test.each(cases)(
    'target %s: explicit version and latest -> expected URLs',
    async (target, expectedExplicitFilename, expectedLatestFilename) => {
      const provider = goodProvider()

      const envExplicit = mkEnv('0.18.3', target)
      const urlExplicit = await getInstallerDownloadUrl(envExplicit, provider)
      expect(urlExplicit).toBe(
        `https://github.com/lumen-oss/lux/releases/download/v0.18.3/${expectedExplicitFilename}`
      )

      const envLatest = mkEnv('latest', target)
      const urlLatest = await getInstallerDownloadUrl(envLatest, provider)
      expect(urlLatest).toBe(
        `https://github.com/lumen-oss/lux/releases/download/v1.0.0/${expectedLatestFilename}`
      )

      const envUndefined = mkEnv(undefined, target)
      const urlUndefined = await getInstallerDownloadUrl(envUndefined, provider)
      expect(urlUndefined).toBe(
        `https://github.com/lumen-oss/lux/releases/download/v1.0.0/${expectedLatestFilename}`
      )
    }
  )
  test('propagates error when provider returns invalid release shape', async () => {
    const env = mkEnv('latest', 'x86_64-linux')
    const provider = badProvider()
    await expect(getInstallerDownloadUrl(env, provider)).rejects.toThrow()
  })
})
