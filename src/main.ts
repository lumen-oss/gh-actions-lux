import { collectConfig } from './inputs.js'
import { GitHubActionsEnv } from './io.js'
import type { Env } from './ports.ts'

export async function run(env?: Env): Promise<void> {
  env = env ?? new GitHubActionsEnv()
  try {
    const config = collectConfig(env)
    env.debug(`Parsed inputs: ${JSON.stringify(config)}`)
    env.debug(`Running on ${env.getTarget()}`)
    env.info(`Installing Lux version: ${config.version}`)
  } catch (error) {
    if (error instanceof Error) {
      env.setFailed(error.message)
    } else {
      env.setFailed(`unexpected error: ${JSON.stringify(error)}`)
    }
  }
}
