import { LuxProvider } from './ports.js'

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

export async function latestLuxVersion(provider: LuxProvider) {
  const release = await provider.latestLuxRelease()
  const release_tag = release['tag_name'] ?? release['name']
  if (typeof release_tag !== 'string') {
    throw new Error('lux release object missing tag_name/name as string')
  }

  return normalizeReleaseTag(release_tag)
}
