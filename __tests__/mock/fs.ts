/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FileSystem } from '../../src/ports.ts'

const MOCK_DATA: Uint8Array = new TextEncoder().encode('mock-fs-bytes')

export class MockFs implements FileSystem {
  private files = new Map<string, Uint8Array>()
  private nextTempId = 0

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    this.files.set(path, data)
  }

  async readFile(path: string): Promise<Uint8Array> {
    const v = this.files.get(path)
    if (!v) throw new Error(`MockFs: file not found: ${path}`)
    return v
  }

  has(path: string): boolean {
    return this.files.has(path)
  }

  async mkdtemp(prefix: string): Promise<string> {
    this.nextTempId += 1
    const id = this.nextTempId.toString(36).padStart(8, '0')
    return `${prefix}${id}`
  }

  async access_read(_path: string): Promise<void> {}

  async readdir(path: string): Promise<string[]> {
    if (path.endsWith('Volumes/install_app')) {
      return ['lux.app']
    } else {
      return []
    }
  }

  async unlink(_path: string): Promise<void> {}

  async copyRecursive(src: string, dest: string): Promise<void> {
    let data: Uint8Array
    try {
      data = await this.readFile(src)
    } catch (_error) {
      data = MOCK_DATA
    }
    this.files.set(dest, data)
  }
}
