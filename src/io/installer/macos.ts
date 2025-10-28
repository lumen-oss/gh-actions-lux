import { exec } from '@actions/exec'
import { addPath } from '@actions/core'
import { tmpdir } from 'os'
import { join as pathJoin } from 'path'
import type { FileSystem, Installer } from '../../ports.js'

class DmgInstaller implements Installer {
  private readonly filesystem: FileSystem

  constructor(fs: FileSystem) {
    this.filesystem = fs
  }

  async install(assetPath: string): Promise<void> {
    await this.filesystem.access_read(assetPath)
    const tmpBase = tmpdir()
    const workDir = await import('fs/promises').then((m) =>
      m.mkdtemp(pathJoin(tmpBase, 'lux-dmg-'))
    )
    // We need to convert to UDTO, to prevent a prompt to accept the license.
    const converted = pathJoin(workDir, 'converted.cdr')
    const mountPoint = '/Volumes/install_app'
    let mounted = false
    try {
      await exec('hdiutil', [
        'convert',
        '-quiet',
        assetPath,
        '-format',
        'UDTO',
        '-o',
        converted
      ])
      await exec('hdiutil', [
        'attach',
        '-nobrowse',
        '-noverify',
        '-mountpoint',
        mountPoint,
        converted
      ])
      mounted = true
      const entries = await this.filesystem.readdir(mountPoint)
      const app = entries.find((e) => e.endsWith('.app'))
      if (!app) throw new Error(`no .app bundle found at ${mountPoint}`)
      const src = pathJoin(mountPoint, app)
      await exec('cp', ['-R', src, '/Applications/'])
      const lx_app_dir = pathJoin('/Applications', app, 'Contents', 'MacOS')
      addPath(lx_app_dir)
    } finally {
      if (mounted) {
        try {
          await exec('hdiutil', ['detach', mountPoint])
        } catch {
          /* best-effort */
        }
      } else {
        try {
          await exec('hdiutil', ['detach', workDir])
        } catch {
          /* best-effort */
        }
      }
      try {
        await this.filesystem.unlink(converted)
      } catch {
        /* ignore cleanup errors */
      }
    }
  }
}

export function createDmgInstaller(fs: FileSystem): Installer {
  return new DmgInstaller(fs)
}
