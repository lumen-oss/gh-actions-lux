import { LuxProvider } from '../../src/ports'

export class MockLuxProvider implements LuxProvider {
  async latestLuxVersion(): Promise<string> {
    return '1.0.0'
  }
}
