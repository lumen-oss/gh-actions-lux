import type { Cache, CacheSpec } from '../../src/ports.js'

export class MockCache implements Cache {
  public restored: CacheSpec[] = []
  public saved: CacheSpec[] = []
  public restore_result: string | undefined

  constructor(restore_result?: string) {
    this.restore_result = restore_result
  }

  async restore(spec: CacheSpec): Promise<string | undefined> {
    this.restored.push(spec)
    return this.restore_result
  }

  async save(spec: CacheSpec): Promise<void> {
    this.saved.push(spec)
  }
}
