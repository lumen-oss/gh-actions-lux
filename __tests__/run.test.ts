import { run } from '../src/main.ts'
import { MockEnv } from './env.ts'

// This test exists to enforce the universal architecture.
describe('universal architecture', () => {
  test('executes without performing real IO', async () => {
    const env = new MockEnv({ version: '2.0.0' })
    await expect(run(env)).resolves.toBeUndefined()
    expect(env.failed).toBeUndefined()
  })
})
