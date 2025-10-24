import { LuxInstallerAsset } from '../../src/lux.js'
import type { Downloader } from '../../src/ports.js'
import type { MockFs } from './fs.js'

const MOCK_DOWNLOAD_BYTES = new TextEncoder().encode('mock-installer-bytes')

export class MockDownloader implements Downloader {
  async download_installer_asset(
    fs: MockFs,
    _asset: LuxInstallerAsset,
    destPath: string
  ): Promise<void> {
    await fs.writeFile(destPath, MOCK_DOWNLOAD_BYTES)
  }
}
