import type { Handle } from './ports.ts'
import { GitHubActionsHandle } from './io/handle.js'
import { collectConfig } from './inputs.js'
import { join as pathJoin } from 'path'

export async function run(handle?: Handle): Promise<void> {
  handle = handle ?? new GitHubActionsHandle()
  const env = handle.getEnv()
  const lux_provider = handle.getLuxProvider()
  const filesystem = handle.getFileSystem()
  const downloader = handle.getDownloader()
  try {
    const config = collectConfig(env)
    env.debug(`Parsed inputs: ${JSON.stringify(config)}`)
    env.debug(`Running on ${env.getTarget()}`)
    const version = env.getVersionInput()
    const lux_release = await lux_provider.getRelease(version)
    const installer_asset = lux_release.assetForTarget(env.getTarget())
    env.info(
      `Found installer release asset: ${JSON.stringify(installer_asset)}`
    )
    env.info(`Downloading Lux ${lux_release.version} installer...`)
    const tmpDir = await filesystem.mkdtemp('lux-')
    const destPath = pathJoin(tmpDir, installer_asset.file_name)
    await downloader.download_installer_asset(
      filesystem,
      installer_asset,
      destPath
    )
    env.info(`Downloaded ${installer_asset.file_name} to ${destPath}`)
  } catch (error) {
    if (error instanceof Error) {
      env.setFailed(error.message)
    } else {
      env.setFailed(`unexpected error: ${JSON.stringify(error)}`)
    }
  }
}
