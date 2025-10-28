import { exec } from '@actions/exec'
import type { OS } from '../../src/ports.ts'

export class RealOS implements OS {
  async exec(commandLine: string, args: string[] = []): Promise<number> {
    return await exec(commandLine, args)
  }
}

export function createRealOS(): OS {
  return new RealOS()
}
