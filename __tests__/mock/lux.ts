import { LuxProvider } from '../../src/ports'

export class MockLuxProvider implements LuxProvider {
  async latestLuxRelease(): Promise<Record<string, unknown>> {
    return {
      tag_name: 'v1.0.0',
      name: 'v1.0.0'
    }
  }
}
