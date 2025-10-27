import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import path from 'path'
import type { Installer } from '../../ports.js'

export class ExeInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)

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

export function createExeInstaller(): Installer {
  return new ExeInstaller()
}
