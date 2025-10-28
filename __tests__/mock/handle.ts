import type {
  Handle,
  Env,
  LuxProvider,
  Downloader,
  FileSystem,
  OS
} from '../../src/ports.ts'

export class MockHandle implements Handle {
  private readonly env: Env
  private readonly provider: LuxProvider
  private readonly downloader: Downloader
  private readonly fs: FileSystem
  private readonly os: OS

  constructor(
    env: Env,
    provider: LuxProvider,
    downloader: Downloader,
    fs: FileSystem,
    os: OS
  ) {
    this.env = env
    this.provider = provider
    this.downloader = downloader
    this.fs = fs
    this.os = os
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

  getOS(): OS {
    return this.os
  }
}
