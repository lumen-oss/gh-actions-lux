import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import type { Installer } from '../../ports.js'
import path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class ExeInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)

    const installDir = path.join('c:', 'Program Files', 'lux')
    try {
      await exec.exec('powershell.exe', [
        '-NoProfile',
        '-WindowStyle',
        'Hidden',
        'Start-Process',
        assetPath,
        '-Wait',
        '-ArgumentList',
        `/P, /D="${installDir}"`,
      ])
    } catch (err) {
      throw new Error(
        `failed to perform silent install for ${assetPath}:\n\n${err}`
      )
    }
    core.addPath(installDir)
  }
}

export function createExeInstaller(): Installer {
  return new ExeInstaller()
}
