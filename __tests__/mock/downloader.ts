import { LuxInstallerAsset } from '../../src/lux.js'
import type { Downloader } from '../../src/ports.js'
import type { MockFs } from './fs.js'

const MOCK_DOWNLOAD_BYTES = new TextEncoder().encode('mock-installer-bytes')

export class MockDownloader implements Downloader {
  private readonly filesystem: MockFs

  constructor(fs: MockFs) {
    this.filesystem = fs
  }

  async download_installer_asset(
    _asset: LuxInstallerAsset,
    destDir: string
  ): Promise<void> {
    await this.filesystem.writeFile(destDir, MOCK_DOWNLOAD_BYTES)
  }
}
