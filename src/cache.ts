import { posix, win32 } from 'path'
import type { Cache, CacheSpec, Env, Target } from './ports.js'

function luxPathsFor(target: Target, env: Env): string[] {
  switch (target) {
    case 'x86_64-linux':
    case 'aarch64-linux': {
      const home = env.getEnvVar('HOME') || env.getEnvVar('USERPROFILE')
      const data =
        env.getEnvVar('XDG_DATA_HOME') ||
        (home ? posix.join(home, '.local', 'share') : undefined)
      const cache =
        env.getEnvVar('XDG_CACHE_HOME') ||
        (home ? posix.join(home, '.cache') : undefined)
      return [
        ...(data ? [posix.join(data, 'lux')] : []),
        ...(cache ? [posix.join(cache, 'lux')] : [])
      ]
    }
    case 'aarch64-macos': {
      const home = env.getEnvVar('HOME')
      if (!home) return []
      return [
        posix.join(home, 'Library', 'Application Support', 'org.lumenlabs.lux'),
        posix.join(home, 'Library', 'Caches', 'org.lumenlabs.lux')
      ]
    }
    case 'x86_64-windows': {
      const localAppData = env.getEnvVar('LOCALAPPDATA')
      if (!localAppData) return []
      return [
        win32.join(localAppData, 'lumenlabs', 'lux', 'data'),
        win32.join(localAppData, 'lumenlabs', 'lux', 'cache')
      ]
    }
    default:
      throw new Error(`unsupported target: ${String(target)}`)
  }
}

export function cachePathsFor(target: Target, env: Env): string[] {
  return ['.lux', ...luxPathsFor(target, env)]
}

export function cacheSpecFor(env: Env, version: string): CacheSpec {
  const target = env.getTarget()
  return {
    paths: cachePathsFor(target, env),
    key: `${target}-lux-${version}`,
    restoreKeys: [`${target}-lux-`]
  }
}

export async function restoreCache(
  env: Env,
  cache: Cache,
  version: string
): Promise<void> {
  const spec = cacheSpecFor(env, version)
  const hit = await cache.restore(spec)
  if (hit !== spec.key) env.saveState('lux_version', version)
}
