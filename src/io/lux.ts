import {
  LuxProviderError as LatestLuxVersionRequestError,
  type LuxProvider
} from '../ports.js'

export class GitHubReleasesLuxProvider implements LuxProvider {
  private readonly owner = 'lumen-oss'
  private readonly repo = 'lux'
  private readonly token?: string

  constructor() {
    this.token = process.env.GITHUB_TOKEN || undefined
  }

  async latestLuxRelease(): Promise<Record<string, unknown>> {
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
    return release
  }
}
