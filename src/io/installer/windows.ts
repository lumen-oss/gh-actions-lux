import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'
import type { FileSystem, Installer } from '../../ports.js'

class ExeInstaller implements Installer {
  private readonly filesystem: FileSystem

  constructor(fs: FileSystem) {
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
    addPath(installDir)
  }
}

export function createExeInstaller(fs: FileSystem): Installer {
  return new ExeInstaller(fs)
}
