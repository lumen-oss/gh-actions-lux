export type GitHubReleaseAsset = {
  name?: string
  browser_download_url?: string
  [k: string]: unknown
}

export type GitHubRelease = {
  tag_name?: string
  name?: string
  assets?: GitHubReleaseAsset[]
  [k: string]: unknown
}
