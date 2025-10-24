import { type GitHubRelease } from './github.js'
import { Target } from './ports.js'

export type LuxInstallerAsset = {
  file_name: string
  download_url: string
  sha256sum: string
}

export class LuxRelease {
  readonly version: string
  readonly assets: LuxInstallerAsset[]

  constructor(version: string, assets: LuxInstallerAsset[]) {
    this.version = version
    this.assets = assets
  }

  assetForTarget(target: Target): LuxInstallerAsset {
    const expected = installerFilenameForTarget(this.version, target)
    const found = this.assets.find((a) => a.file_name === expected)
    if (!found) {
      throw new LuxReleaseError(
        `no Lux installer release asset found for target: ${target} (expected filename: ${expected})`
      )
    }
    return found
  }
}

export class LuxReleaseError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'LuxReleaseError'
  }
}

/**
 * Normalize a GitHub release tag:
 * - removes leading `v`
 * - trims whitespace
 */
function normalizeReleaseTag(tag: unknown): string {
  if (typeof tag !== 'string') {
    throw new TypeError(
      `normalizeReleaseTag: expected string, got ${typeof tag}`
    )
  }
  return tag.trim().replace(/^v/, '')
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

/**
 * Expected installer filenames for a given normalized version.
 */
function expectedInstallerNamesForVersion(version: string): string[] {
  return [
    `lux-cli_${version}_aarch64.dmg`,
    `lx_${version}_amd64.deb`,
    `lx_${version}_arm64.deb`,
    `lx_${version}_x64-setup.exe`
  ]
}

/**
 * Extract a sha256 hex string from a GitHub asset digest (if present).
 */
function extractSha256FromDigest(digest: unknown): string | undefined {
  if (typeof digest !== 'string') return undefined
  const m = digest.match(/^sha256:([a-fA-F0-9]{64})$/)
  return m ? m[1].toLowerCase() : undefined
}

/**
 * Map a `GitHubRelease` (raw JSON) to a `LuxRelease`.
 */
export function mapGithubReleaseToLuxRelease(gh: GitHubRelease): LuxRelease {
  const tagNameRaw = gh.tag_name ?? gh.name
  if (typeof tagNameRaw !== 'string') {
    throw new LuxReleaseError('release object missing tag_name/name as string')
  }
  const version = normalizeReleaseTag(tagNameRaw)

  const assets = Array.isArray(gh.assets) ? gh.assets : []

  const nameToAsset = new Map<string, unknown>()
  for (const a of assets) {
    if (!a) continue
    const name = typeof a.name === 'string' ? a.name : undefined
    if (!name) continue
    nameToAsset.set(name, a)
  }

  const expectedInstallerNames = expectedInstallerNamesForVersion(version)
  const luxInstallerAssets: LuxInstallerAsset[] = []

  for (const expectedInstallerName of expectedInstallerNames) {
    const ghAsset = nameToAsset.get(expectedInstallerName) as
      | Record<string, unknown>
      | undefined
    if (!ghAsset) {
      continue
    }

    const download_url =
      typeof ghAsset['browser_download_url'] === 'string'
        ? ghAsset['browser_download_url']
        : undefined
    if (!download_url) {
      throw new LuxReleaseError(
        `installer asset ${expectedInstallerName} missing browser_download_url`
      )
    }

    const sha256 = extractSha256FromDigest(ghAsset['digest'])
    if (!sha256) {
      throw new LuxReleaseError(
        `installer asset ${expectedInstallerName} missing sha256 digest in asset.digest`
      )
    }

    luxInstallerAssets.push({
      file_name: expectedInstallerName,
      download_url,
      sha256sum: sha256
    })
  }

  return new LuxRelease(version, luxInstallerAssets)
}
