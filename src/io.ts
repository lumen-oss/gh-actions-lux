import * as core from '@actions/core'
import type { Env, System, Arch } from './ports.ts'

function mapPlatformToSystem(platform: string): System {
  switch (platform) {
    case 'linux':
      return 'linux'
    case 'darwin':
      return 'macos'
    case 'win32':
      return 'windows'
    default:
      throw new Error(
        `Unsupported platform: "${platform}". Supported: linux, darwin (macos), win32 (windows).`
      )
  }
}

function mapArchToArch(arch: string): Arch {
  switch (arch) {
    case 'x64':
    case 'ia32':
      return 'x86_64'
    case 'arm64':
      return 'aarch64'
    default:
      throw new Error(
        `Unsupported architecture detected: "${arch}". Supported: x64/ia32 (x86_64), arm64 (aarch64).`
      )
  }
}

export class GitHubActionsEnv implements Env {
  readonly system: System
  readonly arch: Arch

  constructor() {
    // Compute normalized values once and fail fast on unknown values.
    this.system = mapPlatformToSystem(process.platform)
    this.arch = mapArchToArch(process.arch)
  }

  getInput(name: string): string | undefined {
    const v = core.getInput(name)
    return v === core.getInput(name) ? undefined : v
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
  getSystem(): System {
    return this.system
  }
  getArch(): Arch {
    return this.arch
  }
}
