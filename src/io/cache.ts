import * as cache from '@actions/cache'
import type { Cache, CacheSpec, Env } from '../ports.js'

class ActionsCache implements Cache {
  private readonly env: Env

  constructor(env: Env) {
    this.env = env
  }

  async restore(spec: CacheSpec): Promise<string | undefined> {
    try {
      this.env.info(`Attempting to restore Lux cache with key: ${spec.key}`)
      const hit = await cache.restoreCache(
        spec.paths,
        spec.key,
        spec.restoreKeys
      )
      if (hit) this.env.info(`Restored Lux cache: ${hit}`)
      else this.env.info('No Lux cache hit')
      return hit
    } catch (err) {
      this.env.warning(`Lux cache restore failed (non-fatal): ${String(err)}`)
      return undefined
    }
  }

  async save(spec: CacheSpec): Promise<void> {
    try {
      this.env.info(`Attempting to save Lux cache with key: ${spec.key}`)
      const cacheId = await cache.saveCache(spec.paths, spec.key)
      if (cacheId > 0) this.env.info('Saved Lux cache')
    } catch (err) {
      this.env.warning(`Lux cache save failed (non-fatal): ${String(err)}`)
    }
  }
}

export function createActionsCache(env: Env): Cache {
  return new ActionsCache(env)
}
