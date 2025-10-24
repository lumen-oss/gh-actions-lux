import type { Installer } from '../../src/ports.js'

export class MockInstaller implements Installer {
  paths: string[] = []

  async install(path: string): Promise<void> {
    this.paths.push(path)
  }
}
