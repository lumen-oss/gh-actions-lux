import { exec } from '@actions/exec'
import type { FileSystem, Installer } from '../../ports.js'

class DebInstaller implements Installer {
  private readonly filesystem: FileSystem

  constructor(fs: FileSystem) {
    this.filesystem = fs
  }

  async install(assetPath: string): Promise<void> {
    await this.filesystem.access_read(assetPath)
    await exec('sudo', ['dpkg', '-i', assetPath])
  }
}

export function createDebInstaller(fs: FileSystem): Installer {
  return new DebInstaller(fs)
}
