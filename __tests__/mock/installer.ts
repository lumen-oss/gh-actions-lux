import type { Env, Installer } from '../../src/ports.js'

export class MockInstaller implements Installer {
  env: Env
  paths: string[] = []

  constructor(env: Env) {
    this.env = env
  }

  async install(path: string): Promise<void> {
    this.paths.push(path)
    this.env.addPath(path)
  }
}
