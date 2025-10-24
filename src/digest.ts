import { createHash } from 'crypto'
import type { FileSystem } from './ports.js'

export class InvalidChecksumError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'InvalidChecksumError'
  }
}

export async function computeFileSha256(
  fs: FileSystem,
  path: string
): Promise<string> {
  const data = await fs.readFile(path)
  const h = createHash('sha256')
  h.update(data)
  return h.digest('hex')
}

export async function verifyFileSha256(
  fs: FileSystem,
  path: string,
  expectedHex: string
): Promise<void> {
  const actual = await computeFileSha256(fs, path)
  if (actual.toLowerCase() !== expectedHex.toLowerCase()) {
    throw new InvalidChecksumError(
      `sha256 mismatch for ${path}: expected ${expectedHex.toLowerCase()}, got ${actual.toLowerCase()}`
    )
  }
}
