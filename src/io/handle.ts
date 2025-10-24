import { Downloader, Env, FileSystem, Handle, LuxProvider } from '../ports.js'
import { DiskDownloader } from './downloader.js'
import { GitHubActionsEnv } from './env.js'
import { DiskFileSystem } from './filesystem.js'
import { GitHubReleasesLuxProvider } from './lux.js'

export class GitHubActionsHandle implements Handle {
  private readonly env: Env
  private readonly lux_provider: LuxProvider
  private readonly filesytem: FileSystem
  private readonly downloader: Downloader

  constructor() {
    this.env = new GitHubActionsEnv()
    this.lux_provider = new GitHubReleasesLuxProvider()
    this.filesytem = new DiskFileSystem()
    this.downloader = new DiskDownloader()
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
}
