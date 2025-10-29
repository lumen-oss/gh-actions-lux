import { ActionConfig, collectConfig } from '../inputs.js'
import {
  Cache,
  Downloader,
  Env,
  FileSystem,
  Handle,
  LuxProvider,
  OS
} from '../ports.js'
import { createActionsCache } from './cache.js'
import { createDiskDownloader } from './downloader.js'
import { createGitHubActionsEnv } from './env.js'
import { createDiskFileSystem } from './filesystem.js'
import { createGitHubReleasesLuxProvider } from './lux.js'
import { createRealOS } from './os.js'

export class GitHubActionsHandle implements Handle {
  private readonly env: Env
  private readonly config: ActionConfig
  private readonly lux_provider: LuxProvider
  private readonly filesytem: FileSystem
  private readonly os: OS
  private readonly downloader: Downloader
  private readonly cache: Cache

  constructor() {
    this.env = createGitHubActionsEnv()
    this.config = collectConfig(this.env)
    this.lux_provider = createGitHubReleasesLuxProvider(this.config)
    this.filesytem = createDiskFileSystem()
    this.downloader = createDiskDownloader(this.filesytem)
    this.os = createRealOS()
    this.cache = createActionsCache(this.env)
  }

  getEnv(): Env {
    return this.env
  }

  getConfig(): ActionConfig {
    return this.config
  }

  getLuxProvider(): LuxProvider {
    return this.lux_provider
  }

  getFileSystem(): FileSystem {
    return this.filesytem
  }

  getDownloader(): Downloader {
    return this.downloader
  }

  getOS(): OS {
    return this.os
  }

  getCache(): Cache {
    return this.cache
  }
}
