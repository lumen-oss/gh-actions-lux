import type { Handle } from './ports.ts'
import { GitHubActionsHandle } from './io/handle.js'
import { collectConfig } from './inputs.js'
import { getInstallerDownloadUrl } from './lux.js'

export async function run(handle?: Handle): Promise<void> {
  handle = handle ?? new GitHubActionsHandle()
  const env = handle.getEnv()
  const lux_provider = handle.getLuxProvider()
  try {
    const config = collectConfig(env)
    env.debug(`Parsed inputs: ${JSON.stringify(config)}`)
    env.debug(`Running on ${env.getTarget()}`)
    env.info(`Installing Lux version: ${config.version}`)
    const installer_download_url = await getInstallerDownloadUrl(
      env,
      lux_provider
    )
    env.info(`Installer download URL: ${installer_download_url}`)
  } catch (error) {
    if (error instanceof Error) {
      env.setFailed(error.message)
    } else {
      env.setFailed(`unexpected error: ${JSON.stringify(error)}`)
    }
  }
}
