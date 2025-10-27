import { promises as fs } from 'fs'
import { dirname, join as pathJoin } from 'path'
import { tmpdir } from 'os'
import type { FileSystem } from '../ports.js'

class DiskFileSystem implements FileSystem {
  async readFile(path: string): Promise<Uint8Array> {
    const buf = await fs.readFile(path)
    return new Uint8Array(buf)
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    await fs.mkdir(dirname(path), { recursive: true })
    await fs.writeFile(path, Buffer.from(data))
  }

  async mkdtemp(prefix: string): Promise<string> {
    return await fs.mkdtemp(pathJoin(tmpdir(), prefix))
  }
}

export function createDiskFileSystem(): FileSystem {
  return new DiskFileSystem()
}
