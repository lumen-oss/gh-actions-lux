import { LuxProviderError, type LuxProvider } from '../ports.js'
import { mapGithubReleaseToLuxRelease, type LuxRelease } from '../lux.js'
import { GitHubRelease } from '../github.js'

class GitHubReleasesLuxProvider implements LuxProvider {
  private readonly owner = 'lumen-oss'
  private readonly repo = 'lux'
  private readonly token?: string

  constructor() {
    this.token = process.env.GITHUB_TOKEN || undefined
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gh-actions-lux'
    }
    if (this.token) h.Authorization = `token ${this.token}`
    return h
  }

  private async fetchJson(url: string): Promise<Record<string, unknown>> {
    const res = await fetch(url, { headers: this.headers() })
    if (!res.ok) {
      const body = (await res.text().catch(() => '')).slice(0, 200)
      throw new LuxProviderError(
        `failed to fetch ${url}: ${res.status} ${res.statusText} ${body}`
      )
    }
    const json = await res.json().catch(() => {
      throw new LuxProviderError('invalid JSON response from releases API')
    })
    if (typeof json !== 'object' || json === null) {
      throw new LuxProviderError('unexpected response shape (not an object)')
    }
    return json as Record<string, unknown>
  }

  private async getGhReleaseLatest(): Promise<GitHubRelease> {
    const url = `https://api.github.com/repos/${encodeURIComponent(this.owner)}/${encodeURIComponent(
      this.repo
    )}/releases/latest`
    return this.fetchJson(url) as Promise<GitHubRelease>
  }

  private async getGhReleaseByTag(tag: string): Promise<GitHubRelease> {
    const normalized = String(tag).replace(/^v/, '')
    const tagName = `v${normalized}`
    const url = `https://api.github.com/repos/${encodeURIComponent(this.owner)}/${encodeURIComponent(
      this.repo
    )}/releases/tags/${encodeURIComponent(tagName)}`
    return this.fetchJson(url) as Promise<GitHubRelease>
  }

  async getRelease(rawVersion: string): Promise<LuxRelease> {
    let ghRelease: GitHubRelease
    if (!rawVersion || rawVersion === 'latest') {
      ghRelease = await this.getGhReleaseLatest()
    } else {
      ghRelease = await this.getGhReleaseByTag(rawVersion)
    }
    return mapGithubReleaseToLuxRelease(ghRelease)
  }
}

export function createGitHubReleasesLuxProvider(): LuxProvider {
  return new GitHubReleasesLuxProvider()
}
