import type {
  Handle,
  Env,
  LuxProvider,
  Downloader,
  FileSystem,
  Installer
} from '../../src/ports.ts'
import { MockInstaller } from './installer.ts'

export class MockHandle implements Handle {
  private readonly env: Env
  private readonly provider: LuxProvider
  private readonly downloader: Downloader
  private readonly fs: FileSystem

  constructor(
    env: Env,
    provider: LuxProvider,
    downloader: Downloader,
    fs: FileSystem
  ) {
    this.env = env
    this.provider = provider
    this.downloader = downloader
    this.fs = fs
  }

  getEnv(): Env {
    return this.env
  }

  getLuxProvider(): LuxProvider {
    return this.provider
  }

  getDownloader(): Downloader {
    return this.downloader
  }

  getFileSystem(): FileSystem {
    return this.fs
  }

  getInstaller(): Installer {
    return new MockInstaller()
  }
}
