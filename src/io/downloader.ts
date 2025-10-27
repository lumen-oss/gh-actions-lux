import { verifyFileSha256 } from '../digest.js'
import { LuxInstallerAsset } from '../lux.js'
import type { Downloader, FileSystem } from '../ports.js'

export class DownloadError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'DownloadError'
  }
}

class DiskDownloader implements Downloader {
  async download_installer_asset(
    fs: FileSystem,
    asset: LuxInstallerAsset,
    destPath: string
  ): Promise<void> {
    const url = asset.download_url
    const res = await fetch(url)
    if (!res.ok) {
      throw new DownloadError(
        `failed to download ${url}: ${res.status} ${res.statusText}`
      )
    }
    const ab = await res.arrayBuffer()
    const data = new Uint8Array(ab)
    await fs.writeFile(destPath, data)
    await verifyFileSha256(fs, destPath, asset.sha256sum)
  }
}

export function createDiskDownloader(): Downloader {
  return new DiskDownloader()
}
