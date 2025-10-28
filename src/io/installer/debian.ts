import type { FileSystem, Installer, OS } from '../../ports.js'

class DebInstaller implements Installer {
  private readonly filesystem: FileSystem
  private readonly os: OS

  constructor(fs: FileSystem, os: OS) {
    this.filesystem = fs
    this.os = os
  }

  async install(assetPath: string): Promise<void> {
    await this.filesystem.access_read(assetPath)
    await this.os.exec('sudo', ['dpkg', '-i', assetPath])
  }
}

export function createDebInstaller(fs: FileSystem, os: OS): Installer {
  return new DebInstaller(fs, os)
}
