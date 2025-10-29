import { join as pathJoin } from 'path'
import { Env, FileSystem, Handle, OS, UnsupportedTargetError } from './ports.js'

export interface Installer {
  install(assetPath: string): Promise<void>
}

export function createInstaller(handle: Handle): Installer {
  const env = handle.getEnv()
  switch (env.getTarget()) {
    case 'x86_64-linux':
    case 'aarch64-linux':
      return createDebInstaller(handle.getFileSystem(), handle.getOS())
    case 'aarch64-macos':
      return createDmgInstaller(env, handle.getFileSystem(), handle.getOS())
    case 'x86_64-windows':
      return createExeInstaller(env, handle.getFileSystem(), handle.getOS())
    default:
      throw new UnsupportedTargetError(
        `no installer available for target: ${String(env.getTarget())}`
      )
  }
}

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

function createDebInstaller(fs: FileSystem, os: OS): Installer {
  return new DebInstaller(fs, os)
}

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
    const workDir = await this.filesystem.mkdtemp('lux-dmg-')
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
      await this.filesystem.copyRecursive(src, '/Applications/')
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

function createDmgInstaller(env: Env, fs: FileSystem, os: OS): Installer {
  return new DmgInstaller(env, fs, os)
}

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

    const installDir = pathJoin('c:', 'Program Files', 'lux')
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

function createExeInstaller(env: Env, fs: FileSystem, os: OS): Installer {
  return new ExeInstaller(env, fs, os)
}
