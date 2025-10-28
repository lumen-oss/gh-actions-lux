import {
  Downloader,
  Env,
  FileSystem,
  Handle,
  Installer,
  LuxProvider,
  OS,
  UnsupportedTargetError
} from '../ports.js'
import { createDiskDownloader } from './downloader.js'
import { createGitHubActionsEnv } from './env.js'
import { createDiskFileSystem } from './filesystem.js'
import { createDebInstaller } from './installer/debian.js'
import { createDmgInstaller } from './installer/macos.js'
import { createExeInstaller } from './installer/windows.js'
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

  getInstaller(): Installer {
    const env = this.getEnv()
    switch (env.getTarget()) {
      case 'x86_64-linux':
      case 'aarch64-linux':
        return createDebInstaller(this.filesytem, this.os)
      case 'aarch64-macos':
        return createDmgInstaller(this.env, this.filesytem, this.os)
      case 'x86_64-windows':
        return createExeInstaller(this.env, this.filesytem, this.os)
      default:
        throw new UnsupportedTargetError(
          `no installer available for target: ${String(env.getTarget())}`
        )
    }
  }
}
