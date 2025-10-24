import { spawn } from 'child_process'
import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'
import type { Installer } from '../../ports.js'
import path from 'path'

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

async function addToPath(dir: string): Promise<void> {
  const current = process.env.PATH ?? ''
  const normalized = dir.replace(/\//g, '\\').replace(/\\+$/, '')
  if (current.toLowerCase().includes(normalized.toLowerCase())) {
    process.env.PATH = `${current}`
    return
  }
  await runCommand('setx', ['PATH', `${current};${normalized}`])
  process.env.PATH = `${current};${normalized}`
}

export class ExeInstaller implements Installer {
  async install(assetPath: string): Promise<void> {
    await access(assetPath, fsConstants.R_OK)

    try {
      await runCommand(assetPath, [])
      const installDir = path.join('C:', 'Program Files', 'lux')
      await addToPath(installDir)
    } catch (err) {
      throw new Error(
        `failed to perform silent install for ${assetPath}:\n\n${err}`
      )
    }
  }
}

export function createExeInstaller(): Installer {
  return new ExeInstaller()
}
