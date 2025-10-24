import {
  Downloader,
  Env,
  FileSystem,
  Handle,
  Installer,
  LuxProvider,
  UnsupportedTargetError
} from '../ports.js'
import { DiskDownloader } from './downloader.js'
import { GitHubActionsEnv } from './env.js'
import { DiskFileSystem } from './filesystem.js'
import { createDebInstaller } from './installer/debian.js'
import { createDmgInstaller } from './installer/macos.js'
import { createExeInstaller } from './installer/windows.js'
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

  getInstaller(): Installer {
    const env = this.getEnv()
    switch (env.getTarget()) {
      case 'x86_64-linux':
      case 'aarch64-linux':
        return createDebInstaller()
      case 'aarch64-macos':
        return createDmgInstaller()
      case 'x86_64-windows':
        return createExeInstaller()
      default:
        throw new UnsupportedTargetError(
          `no installer available for target: ${String(env.getTarget())}`
        )
    }
  }
}
