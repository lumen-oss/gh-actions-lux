import { collectConfig } from '../src/inputs.ts'
import { MockEnv } from './env.ts'

describe('parseActionInputs', () => {
  test('collectConfig reads version from env', () => {
    const env = new MockEnv({ version: '2.0.0' })
    const config = collectConfig(env)
    expect(config.version).toBe('2.0.0')
  })

  test('collectConfig defaults version to latest', () => {
    const env = new MockEnv()
    const config = collectConfig(env)
    expect(config.version).toBe('latest')
  })
})
