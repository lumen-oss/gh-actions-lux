import type { Env, Target } from '../src/ports.ts'

export class MockEnv implements Env {
  private inputs: Record<string, string | undefined>
  public debugCalls: string[] = []
  public infoCalls: string[] = []
  public failed?: string

  constructor(inputs: Record<string, string | undefined> = {}) {
    this.inputs = inputs
  }
  getInput(name: string): string | undefined {
    return this.inputs[name]
  }
  debug(message: string): void {
    this.debugCalls.push(message)
  }
  info(message: string): void {
    this.infoCalls.push(message)
  }
  setFailed(message: string): void {
    this.failed = message
  }
  getTarget(): Target {
    return 'x86_64-linux'
  }
}
