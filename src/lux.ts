import { Env, LuxProvider, type Target } from './ports.js'

/**
 * Minimal normalization helper for release tags.
 * - accepts strings like 'v1.2.3' or '1.2.3' and returns '1.2.3'
 */
function normalizeReleaseTag(tag: unknown): string {
  if (typeof tag !== 'string') {
    throw new TypeError(
      `normalizeReleaseTag: expected string, got ${typeof tag}`
    )
  }
  return tag.trim().replace(/^v/, '')
}

async function latestLuxVersion(provider: LuxProvider) {
  const release = await provider.latestLuxRelease()
  const release_tag = release['tag_name'] ?? release['name']
  if (typeof release_tag !== 'string') {
    throw new Error('lux release object missing tag_name/name as string')
  }

  return normalizeReleaseTag(release_tag)
}

function installerFilenameForTarget(version: string, target: Target): string {
  switch (target) {
    case 'aarch64-macos':
      return `lux-cli_${version}_aarch64.dmg`
    case 'x86_64-linux':
      return `lx_${version}_amd64.deb`
    case 'aarch64-linux':
      return `lx_${version}_arm64.deb`
    case 'x86_64-windows':
      return `lx_${version}_x64-setup.exe`
    default:
      throw new Error(
        `non-exhaustive switch on target: ${String(target)}. This is a bug!`
      )
  }
}

function installerDownloadUrl(version: string, target: Target): string {
  const installer = installerFilenameForTarget(version, target)
  const tagPart = `v${version}`
  return `https://github.com/lumen-oss/lux/releases/download/${encodeURIComponent(tagPart)}/${encodeURIComponent(
    installer
  )}`
}

export async function getInstallerDownloadUrl(
  env: Env,
  provider: LuxProvider
): Promise<string> {
  const rawVersion = env.getVersionInput()
  const target = env.getTarget()

  let version: string
  if (!rawVersion || rawVersion === 'latest') {
    version = await latestLuxVersion(provider)
  } else {
    version = rawVersion
  }

  return installerDownloadUrl(version, target)
}
