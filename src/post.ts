import { cacheSpecFor } from './cache.js'
import type { Handle } from './ports.js'

export async function run_post(handle: Handle): Promise<void> {
  const env = handle.getEnv()
  const version = env.getState('lux_version')
  if (!version) return
  await handle.getCache().save(cacheSpecFor(env, version))
}
