import { spawn } from 'child_process'
import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'
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

export class DebInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)
    await runCommand('sudo', ['dpkg', '-i', assetPath])
  }
}

export function createDebInstaller(): Installer {
  return new DebInstaller()
}
