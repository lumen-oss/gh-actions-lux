import { run } from '../src/main.ts'
import { MockEnv } from './mock/env.ts'
import { MockHandle } from './mock/handle.ts'
import { MockLuxProvider } from './mock/lux.ts'

// This test exists to enforce the universal architecture.
describe('universal architecture', () => {
  test('executes without performing real IO', async () => {
    const env = new MockEnv({ version: '2.0.0' })
    const luxProvider = new MockLuxProvider()
    const handle = new MockHandle(env, luxProvider)
    await expect(run(handle)).resolves.toBeUndefined()
    expect(env.failed).toBeUndefined()
  })
})
