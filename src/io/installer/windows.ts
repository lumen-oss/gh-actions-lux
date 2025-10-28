import { exec } from '@actions/exec'
import path from 'path'
import type { Env, FileSystem, Installer } from '../../ports.js'

class ExeInstaller implements Installer {
  private readonly env: Env
  private readonly filesystem: FileSystem

  constructor(env: Env, fs: FileSystem) {
    this.env = env
    this.filesystem = fs
  }

  async install(assetPath: string): Promise<void> {
    await this.filesystem.access_read(assetPath)

    const installDir = path.join('c:', 'Program Files', 'lux')
    try {
      await exec('powershell.exe', [
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

export function createExeInstaller(env: Env, fs: FileSystem): Installer {
  return new ExeInstaller(env, fs)
}
