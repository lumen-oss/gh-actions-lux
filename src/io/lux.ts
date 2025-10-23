import {
  LuxProviderError as LatestLuxVersionRequestError,
  type LuxProvider
} from '../ports.js'

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

export class GitHubReleasesLuxProvider implements LuxProvider {
  private readonly owner = 'lumen-oss'
  private readonly repo = 'lux'
  private readonly token?: string

  constructor() {
    this.token = process.env.GITHUB_TOKEN || undefined
  }

  async latestLuxVersion(): Promise<string> {
    const url = `https://api.github.com/repos/${encodeURIComponent(this.owner)}/${encodeURIComponent(
      this.repo
    )}/releases/latest`

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gh-actions-lux'
    }
    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    const res = await fetch(url, { headers })
    if (!res.ok) {
      const body = (await res.text().catch(() => '')).slice(0, 200)
      throw new LatestLuxVersionRequestError(
        `failed to fetch ${url}: ${res.status} ${res.statusText} ${body}`
      )
    }

    const json = await res.json().catch(() => {
      throw new LatestLuxVersionRequestError(
        'invalid JSON response from releases API'
      )
    })

    if (typeof json !== 'object' || json === null) {
      throw new LatestLuxVersionRequestError(
        'unexpected response shape (not an object)'
      )
    }
    const release = json as Record<string, unknown>

    const release_tag = (json && (release.tag_name ?? release.name)) as unknown
    if (!release_tag) {
      throw new LatestLuxVersionRequestError(
        'release object missing tag_name/name'
      )
    }

    return normalizeReleaseTag(release_tag)
  }
}
