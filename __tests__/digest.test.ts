import { createHash } from 'crypto'
import { MockFs } from './mock/fs.ts'
import {
  computeFileSha256,
  verifyFileSha256,
  InvalidChecksumError
} from '../src/digest.ts'

describe('digest', () => {
  test('computeFileSha256 and verifyFileSha256 compute and verify real bytes', async () => {
    const fs = new MockFs()
    const destPath = 'lx_1.0.0_amd64.deb'
    const payload = new TextEncoder().encode('mock-installer-bytes')
    await fs.writeFile(destPath, payload)

    const expected = createHash('sha256').update(payload).digest('hex')

    const computed = await computeFileSha256(fs, destPath)
    expect(computed).toBe(expected)

    await expect(
      verifyFileSha256(fs, destPath, expected)
    ).resolves.toBeUndefined()
    await expect(
      verifyFileSha256(fs, destPath, 'deadbeef' + expected.slice(8))
    ).rejects.toThrow(InvalidChecksumError)
  })

  test('verifyFileSha256 throws when file content differs', async () => {
    const fs = new MockFs()
    const path = 'lx_1.0.0_arm64.deb'
    const payload = new TextEncoder().encode('original-bytes')
    await fs.writeFile(path, payload)

    const expected = createHash('sha256')
      .update(new TextEncoder().encode('different-bytes'))
      .digest('hex')
    await expect(verifyFileSha256(fs, path, expected)).rejects.toThrow(
      InvalidChecksumError
    )
  })
})
