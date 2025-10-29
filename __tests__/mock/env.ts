/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Env, Target } from '../../src/ports.ts'

export class MockEnv implements Env {
  private target: Target
  private env_vars = new Map<string, string>()
  private inputs: Record<string, string | undefined>
  public debug_calls: string[] = []
  public info_calls: string[] = []
  public warning_calls: string[] = []
  public failed?: string

  constructor(target: Target, inputs: Record<string, string | undefined> = {}) {
    this.target = target
    this.inputs = inputs
  }
  private getInput(name: string): string | undefined {
    return this.inputs[name]
  }
  getVersionInput(): string {
    return this.getInput('version') || 'latest'
  }
  debug(message: string): void {
    this.debug_calls.push(message)
  }
  info(message: string): void {
    this.info_calls.push(message)
  }
  warning(message: string): void {
    this.warning_calls.push(message)
  }
  setFailed(message: string): void {
    this.failed = message
  }
  getTarget(): Target {
    return this.target
  }

  addPath(inputPath: string): void {
    const key = 'PATH'
    const pathSeparator = ':'
    const current = this.env_vars.get(key) ?? process.env.PATH ?? ''
    const newValue = current
      ? `${current}${pathSeparator}${inputPath}`
      : inputPath
    this.env_vars.set(key, newValue)
  }

  getEnvVar(_name: string): string | undefined {
    return undefined
  }
}
