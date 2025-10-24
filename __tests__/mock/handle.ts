import type {
  Handle,
  Env,
  LuxProvider,
  Downloader,
  FileSystem
} from '../../src/ports.ts'
import { MockEnv } from './env.ts'
import { MockLuxProvider } from './lux.ts'
import { MockFs } from './fs.ts'
import { MockDownloader } from './downloader.ts'

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
}

export function createDefaultMockHandle(): MockHandle {
  const fs = new MockFs()
  const downloader = new MockDownloader()
  const provider = new MockLuxProvider()
  const env = new MockEnv()
  return new MockHandle(env, provider, downloader, fs)
}
