import { spawn } from 'child_process'
import { access, readdir } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import { tmpdir } from 'os'
import { join as pathJoin } from 'path'
import type { Installer } from '../../ports.js'

async function runCommand(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    p.stdout?.on('data', (b: Buffer) => {
      stdout += b.toString()
    })
    p.stderr?.on('data', (b: Buffer) => {
      stderr += b.toString()
    })
    p.on('error', (err) => reject(err))
    p.on('close', (code, signal) => {
      if (code === 0) return resolve()
      const msg = `command failed: ${cmd} ${args.join(' ')} exit=${code} signal=${signal}\nstdout:\n${stdout}\nstderr:\n${stderr}`
      reject(new Error(msg))
    })
  })
}

export class DmgInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)

    const mountBase = tmpdir()
    const mountPoint = await import('fs/promises').then((m) =>
      m.mkdtemp(pathJoin(mountBase, 'lux-dmg-'))
    )

    let attached = false

    try {
      await runCommand('hdiutil', [
        'attach',
        '-nobrowse',
        '-noverify',
        '-mountpoint',
        mountPoint,
        assetPath
      ])
      attached = true

      const entries = await readdir(mountPoint)
      const app = entries.find((e) => e.endsWith('.app'))
      if (app) {
        const src = pathJoin(mountPoint, app)
        await runCommand('cp', ['-R', src, '/Applications/'])
        return
      }

      throw new Error(`no .app found inside mounted dmg at ${mountPoint}`)
    } finally {
      if (attached) {
        try {
          await runCommand('hdiutil', ['detach', mountPoint])
        } catch {
          // we ignore detach failures
        }
      }
    }
  }
}

export function createDmgInstaller(): Installer {
  return new DmgInstaller()
}
