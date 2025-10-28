import { tmpdir } from 'os'
import { join as pathJoin } from 'path'
import type { Env, FileSystem, Installer, OS } from '../../ports.js'

class DmgInstaller implements Installer {
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
    const tmpBase = tmpdir()
    const workDir = await import('fs/promises').then((m) =>
      m.mkdtemp(pathJoin(tmpBase, 'lux-dmg-'))
    )
    // We need to convert to UDTO, to prevent a prompt to accept the license.
    const converted = pathJoin(workDir, 'converted.cdr')
    const mountPoint = '/Volumes/install_app'
    let mounted = false
    try {
      await this.os.exec('hdiutil', [
        'convert',
        '-quiet',
        assetPath,
        '-format',
        'UDTO',
        '-o',
        converted
      ])
      await this.os.exec('hdiutil', [
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
      await this.os.exec('cp', ['-R', src, '/Applications/'])
      const lx_app_dir = pathJoin('/Applications', app, 'Contents', 'MacOS')
      this.env.addPath(lx_app_dir)
    } finally {
      if (mounted) {
        try {
          await this.os.exec('hdiutil', ['detach', mountPoint])
        } catch {
          /* best-effort */
        }
      } else {
        try {
          await this.os.exec('hdiutil', ['detach', workDir])
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

export function createDmgInstaller(
  env: Env,
  fs: FileSystem,
  os: OS
): Installer {
  return new DmgInstaller(env, fs, os)
}
