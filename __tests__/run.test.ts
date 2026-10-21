/* eslint-disable jest/expect-expect */

import { run } from '../src/main.ts'
import { run_post } from '../src/post.ts'
import { MockDownloader } from './mock/downloader.ts'
import { MockEnv } from './mock/env.ts'
import { MockFs } from './mock/fs.ts'
import { MockOS } from './mock/os.ts'
import { MockHandle } from './mock/handle.ts'
import { MockLuxProvider } from './mock/lux.ts'
import { Target } from '../src/ports.ts'
import { MockCache } from './mock/cache.ts'
import { collectConfig } from '../src/inputs.ts'

async function testTarget(
  target: Target,
  version = '2.0.0'
): Promise<MockCache> {
  const env = new MockEnv(target, { version })
  const config = collectConfig(env)
  const luxProvider = new MockLuxProvider(config)
  const fs = new MockFs()
  const downloader = new MockDownloader(fs)
  const os = new MockOS()
  const cache = new MockCache()
  const handle = new MockHandle(env, luxProvider, downloader, fs, os, cache)
  await expect(run(handle)).resolves.toBeUndefined()
  await expect(run_post(handle)).resolves.toBeUndefined()
  expect(env.failed).toBeUndefined()
  return cache
}

// This test exists to enforce the universal architecture.
describe('executes without performing real IO', () => {
  test('x86_64-linux', async () => await testTarget('x86_64-linux'))
  test('aarch64-linux', async () => await testTarget('aarch64-linux'))
  test('aarch64-macos', async () => await testTarget('aarch64-macos'))
  test('x86_64-windows', async () => await testTarget('x86_64-windows'))
})

describe('cache versioning', () => {
  test('uses the resolved release version', async () => {
    const cache = await testTarget('x86_64-linux', 'latest')
    expect(cache.restored[0].key).toBe('x86_64-linux-lux-1.0.0')
    expect(cache.saved[0].key).toBe('x86_64-linux-lux-1.0.0')
  })
})
