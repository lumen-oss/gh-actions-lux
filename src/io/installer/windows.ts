import path from 'path'
import type { Env, FileSystem, Installer, OS } from '../../ports.js'

class ExeInstaller implements Installer {
  private readonly env: Env
  private readonly filesystem: FileSystem
  private readonly os: OS

  constructor(env: Env, fs: FileSystem, os: OS) {
    this.env = env
    this.filesystem = fs
    this.os = os
  }

  async install(assetPath: string): Promise<void> {
    await this.filesystem.access_read(assetPath)

    const installDir = path.join('c:', 'Program Files', 'lux')
    try {
      await this.os.exec('powershell.exe', [
        '-NoProfile',
        '-WindowStyle',
        'Hidden',
        'Start-Process',
        assetPath,
        '-Wait',
        '-ArgumentList',
        `/P, /D="${installDir}"`
      ])
    } catch (err) {
      throw new Error(
        `failed to perform silent install for ${assetPath}:\n\n${err}`
      )
    }
    this.env.addPath(installDir)
  }
}

export function createExeInstaller(
  env: Env,
  fs: FileSystem,
  os: OS
): Installer {
  return new ExeInstaller(env, fs, os)
}
