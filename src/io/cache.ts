import * as cache from '@actions/cache'
import { join as pathJoin } from 'path'
import type { Cache, Env } from '../ports.js'

function candidatePaths(env: Env): string[] {
  const paths: string[] = []
  paths.push('./.lux')

  const home = env.getEnvVar('HOME') ?? env.getEnvVar('USERPROFILE')
  if (home) {
    // Linux
    paths.push(pathJoin(home, '.local', 'share', 'lux'))
    paths.push(pathJoin(home, '.local', 'cache', 'lux'))
    // macOS
    paths.push(pathJoin(home, 'Library', 'Application Support', 'lux'))
    paths.push(pathJoin(home, 'Library', 'Caches', 'lux'))
  }

  const localAppData = env.getEnvVar('LOCALAPPDATA')
  if (localAppData) {
    paths.push(pathJoin(localAppData, 'lux'))
    paths.push(pathJoin(localAppData, 'lux', 'Cache'))
  }

  return Array.from(new Set(paths))
}

function cacheKeyFor(env: Env, version: string): string {
  const target = env.getTarget()
  return `${target}-lux-${version}`
}

class ActionsCache implements Cache {
  private readonly env: Env

  constructor(env: Env) {
    this.env = env
  }

  async restore(version: string): Promise<void> {
    const paths = candidatePaths(this.env)
    const primaryKey = cacheKeyFor(this.env, version)
    const restoreKeys = [`${primaryKey}`, `${this.env.getTarget()}-lux-`]

    try {
      this.env.info(`Attempting to restore Lux cache with key: ${primaryKey}`)
      const hit = await cache.restoreCache(paths, primaryKey, restoreKeys)
      if (hit) this.env.info(`Restored Lux cache: ${hit}`)
      else this.env.info('No Lux cache hit')
    } catch (err) {
      this.env.warning(`Lux cache restore failed (non-fatal): ${String(err)}`)
    }
  }

  async save(version: string): Promise<void> {
    const paths = candidatePaths(this.env)
    const key = cacheKeyFor(this.env, version)
    try {
      this.env.info(`Attempting to save Lux cache with key: ${key}`)
      await cache.saveCache(paths, key)
      this.env.info('Saved Lux cache')
    } catch (err: unknown) {
      this.env.warning(`Lux cache save failed (non-fatal): ${String(err)}`)
    }
  }
}

export function createActionsCache(env: Env): Cache {
  return new ActionsCache(env)
}
