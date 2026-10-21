import type { Handle } from './ports.ts'
import { join as pathJoin } from 'path'
import { restoreCache } from './cache.js'
import { createInstaller } from './installer.js'

export async function run(handle: Handle): Promise<void> {
  const env = handle.getEnv()
  const lux_provider = handle.getLuxProvider()
  const filesystem = handle.getFileSystem()
  const downloader = handle.getDownloader()
  const cache = handle.getCache()
  try {
    env.debug(`Running on ${env.getTarget()}`)

    const lux_release = await lux_provider.getRelease()
    await restoreCache(env, cache, lux_release.version)

    const installer_asset = lux_release.assetForTarget(env.getTarget())
    env.info(
      `Found installer release asset: ${JSON.stringify(installer_asset)}`
    )
    env.info(`Downloading Lux ${lux_release.version} installer...`)
    const tmpDir = await filesystem.mkdtemp('lux-')
    const installer_asset_path = pathJoin(tmpDir, installer_asset.file_name)
    await downloader.download_installer_asset(
      installer_asset,
      installer_asset_path
    )
    env.info(
      `Downloaded ${installer_asset.file_name} to ${installer_asset_path}`
    )
    env.info(`Installing Lux ${lux_release.version}...`)
    const installer = createInstaller(handle)
    await installer.install(installer_asset_path)
    env.info('Done.')
  } catch (error) {
    if (error instanceof Error) {
      env.setFailed(error.message)
    } else {
      env.setFailed(`unexpected error: ${JSON.stringify(error)}`)
    }
  }
}
