import type {
  Cache,
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
  private readonly cache: Cache

  constructor(
    env: Env,
    provider: LuxProvider,
    downloader: Downloader,
    fs: FileSystem,
    os: OS,
    cache: Cache
  ) {
    this.env = env
    this.provider = provider
    this.downloader = downloader
    this.fs = fs
    this.os = os
    this.cache = cache
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

  getCache(): Cache {
    return this.cache
  }
}
