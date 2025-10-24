import { run } from '../src/main.ts'
import { MockDownloader } from './mock/downloader.ts'
import { MockEnv } from './mock/env.ts'
import { MockFs } from './mock/fs.ts'
import { MockHandle } from './mock/handle.ts'
import { MockLuxProvider } from './mock/lux.ts'

// This test exists to enforce the universal architecture.
describe('universal architecture', () => {
  test('executes without performing real IO', async () => {
    const env = new MockEnv({ version: '2.0.0' })
    const luxProvider = new MockLuxProvider()
    const downloader = new MockDownloader()
    const fs = new MockFs()
    const handle = new MockHandle(env, luxProvider, downloader, fs)
    await expect(run(handle)).resolves.toBeUndefined()
    expect(env.failed).toBeUndefined()
  })
})
