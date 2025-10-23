import { latestLuxVersion } from '../src/lux'
import { MockLuxProvider } from './mock/lux'

describe('latestLuxVersion', () => {
  test('normalizes release correctly', async () => {
    const provider = new MockLuxProvider()
    const version = await latestLuxVersion(provider)
    expect(version).toBe('1.0.0')
  })
})
