import * as core from '@actions/core'
import { UnsupportedTarget, type Env, type Target } from './ports.js'

function computeTarget(platform: string, arch: string): Target {
  if (platform === 'linux' && arch === 'arm64') {
    return 'aarch64-linux'
  } else if (platform === 'linux' && arch === 'x64') {
    return 'x86_64-linux'
  } else if (platform === 'darwin' && arch === 'arm64') {
    return 'aarch64-macos'
  } else if (platform === 'win32' && arch === 'x64') {
    return 'x86_64-windows'
  }
  throw new UnsupportedTarget(
    `Unsupported architecture ${arch} for platform: ${platform}`
  )
}

export class GitHubActionsEnv implements Env {
  readonly target: Target

  constructor() {
    this.target = computeTarget(process.platform, process.arch)
  }

  getInput(name: string): string | undefined {
    const v = core.getInput(name)
    return v === '' ? undefined : v
  }
  debug(message: string): void {
    core.debug(message)
  }
  info(message: string): void {
    core.info(message)
  }
  setFailed(message: string): void {
    core.setFailed(message)
  }
  getTarget(): Target {
    return this.target
  }
}
