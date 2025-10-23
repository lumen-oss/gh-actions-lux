import { Env, Handle, LuxProvider } from '../../src/ports'

export class MockHandle implements Handle {
  private readonly env: Env
  private readonly lux_provider: LuxProvider

  constructor(env: Env, provider: LuxProvider) {
    this.env = env
    this.lux_provider = provider
  }

  getLuxProvider(): LuxProvider {
    return this.lux_provider
  }
  getEnv(): Env {
    return this.env
  }
}
