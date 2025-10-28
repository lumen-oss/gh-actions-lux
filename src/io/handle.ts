import {
  Downloader,
  Env,
  FileSystem,
  Handle,
  LuxProvider,
  OS
} from '../ports.js'
import { createDiskDownloader } from './downloader.js'
import { createGitHubActionsEnv } from './env.js'
import { createDiskFileSystem } from './filesystem.js'
import { createGitHubReleasesLuxProvider } from './lux.js'
import { createRealOS } from './os.js'

export class GitHubActionsHandle implements Handle {
  private readonly env: Env
  private readonly lux_provider: LuxProvider
  private readonly filesytem: FileSystem
  private readonly os: OS
  private readonly downloader: Downloader

  constructor() {
    this.env = createGitHubActionsEnv()
    this.lux_provider = createGitHubReleasesLuxProvider()
    this.filesytem = createDiskFileSystem()
    this.downloader = createDiskDownloader()
    this.os = createRealOS()
  }

  getLuxProvider(): LuxProvider {
    return this.lux_provider
  }

  getEnv(): Env {
    return this.env
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
}
