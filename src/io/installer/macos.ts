import { spawn } from 'child_process'
import { access, readdir, unlink } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import { tmpdir } from 'os'
import { join as pathJoin } from 'path'
import type { Installer } from '../../ports.js'

type CmdResult = { code: number | null; stdout: string; stderr: string }

async function capture(
  cmd: string,
  args: string[],
  stdin?: string
): Promise<CmdResult> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: stdin ? ['pipe', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe']
    })
    let stdout = ''
    let stderr = ''
    p.stdout?.on('data', (b: Buffer) => {
      stdout += b.toString()
    })
    p.stderr?.on('data', (b: Buffer) => {
      stderr += b.toString()
    })
    p.on('error', (err) => reject(err))
    p.on('close', (code) => resolve({ code, stdout, stderr }))
    if (stdin) {
      try {
        p.stdin?.write(stdin)
        p.stdin?.end()
      } catch {
        /* ignore */
      }
    }
  })
}

async function runStrict(
  cmd: string,
  args: string[],
  stdin?: string
): Promise<void> {
  const r = await capture(cmd, args, stdin)
  if (r.code === 0) return
  throw new Error(
    `command failed: ${cmd} ${args.join(' ')} exit=${r.code}\nstdout:\n${r.stdout}\nstderr:\n${r.stderr}`
  )
}

export class DmgInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)
    const tmpBase = tmpdir()
    const workDir = await import('fs/promises').then((m) =>
      m.mkdtemp(pathJoin(tmpBase, 'lux-dmg-'))
    )
    // We need to convert to UDTO, to prevent a prompt to accept the license.
    const converted = pathJoin(workDir, 'converted.cdr')
    const mountPoint = '/Volumes/install_app'
    let mounted = false
    try {
      await runStrict('hdiutil', [
        'convert',
        '-quiet',
        assetPath,
        '-format',
        'UDTO',
        '-o',
        converted
      ])
      await runStrict('hdiutil', [
        'attach',
        '-nobrowse',
        '-noverify',
        '-mountpoint',
        mountPoint,
        converted
      ])
      mounted = true
      const entries = await readdir(mountPoint)
      const app = entries.find((e) => e.endsWith('.app'))
      if (!app) throw new Error(`no .app bundle found at ${mountPoint}`)
      const src = pathJoin(mountPoint, app)
      await runStrict('cp', ['-R', src, '/Applications/'])
      const binPath = pathJoin('/Applications', app, 'Contents', 'MacOS', 'lx')
      await runStrict('sudo', ['ln', '-sf', binPath, '/usr/local/bin/lx'])
    } finally {
      if (mounted) {
        try {
          await runStrict('hdiutil', ['detach', mountPoint])
        } catch {
          /* best-effort */
        }
      } else {
        try {
          await runStrict('hdiutil', ['detach', workDir])
        } catch {
          /* best-effort */
        }
      }
      try {
        await unlink(converted)
      } catch {
        /* ignore cleanup errors */
      }
    }
  }
}

export function createDmgInstaller(): Installer {
  return new DmgInstaller()
}
