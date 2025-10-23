import { Env, Handle, LuxProvider } from '../ports.js'
import { GitHubActionsEnv } from './env.js'
import { GitHubReleasesLuxProvider } from './lux.js'

export class GitHubActionsHandle implements Handle {
  private readonly env: Env
  private readonly lux_provider: LuxProvider

  constructor() {
    this.env = new GitHubActionsEnv()
    this.lux_provider = new GitHubReleasesLuxProvider()
  }

  getLuxProvider(): LuxProvider {
    return this.lux_provider
  }

  getEnv(): Env {
    return this.env
  }
}
