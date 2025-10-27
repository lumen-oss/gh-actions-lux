import { exec } from '@actions/exec'
import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import type { Installer } from '../../ports.js'

class DebInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)
    await exec('sudo', ['dpkg', '-i', assetPath])
  }
}

export function createDebInstaller(): Installer {
  return new DebInstaller()
}
