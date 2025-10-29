import { downloadTool } from '@actions/tool-cache'
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
  private readonly filesystem: FileSystem

  constructor(fs: FileSystem) {
    this.filesystem = fs
  }

  async download_installer_asset(
    asset: LuxInstallerAsset,
    destPath: string
  ): Promise<void> {
    const artifact = await downloadTool(asset.download_url, destPath)
    await verifyFileSha256(this.filesystem, artifact, asset.sha256sum)
  }
}

export function createDiskDownloader(fs: FileSystem): Downloader {
  return new DiskDownloader(fs)
}
