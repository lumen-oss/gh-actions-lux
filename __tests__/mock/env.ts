import type { Env, Target } from '../../src/ports.ts'

export class MockEnv implements Env {
  private inputs: Record<string, string | undefined>
  public debug_calls: string[] = []
  public info_calls: string[] = []
  public failed?: string

  constructor(inputs: Record<string, string | undefined> = {}) {
    this.inputs = inputs
  }
  private getInput(name: string): string | undefined {
    return this.inputs[name]
  }
  getVersionInput(): string | undefined {
    return this.getInput('version')
  }
  debug(message: string): void {
    this.debug_calls.push(message)
  }
  info(message: string): void {
    this.info_calls.push(message)
  }
  setFailed(message: string): void {
    this.failed = message
  }
  getTarget(): Target {
    return 'x86_64-linux'
  }
}
