import type { Cache } from '../../src/ports.js'

export class MockCache implements Cache {
  public restored: string[] = []
  public saved: string[] = []

  async restore(version: string): Promise<void> {
    this.restored.push(version)
  }

  async save(version: string): Promise<void> {
    this.saved.push(version)
  }
}
