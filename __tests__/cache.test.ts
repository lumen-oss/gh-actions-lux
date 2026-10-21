import { cachePathsFor, cacheSpecFor } from '../src/cache.ts'
import type { Target } from '../src/ports.ts'
import { MockEnv } from './mock/env.ts'

function envFor(target: Target, env_vars: Record<string, string>): MockEnv {
  return new MockEnv(target, {}, env_vars)
}

describe('cachePathsFor', () => {
  test('linux defaults', () => {
    const paths = cachePathsFor(
      'x86_64-linux',
      envFor('x86_64-linux', { HOME: '/home/runner' })
    )
    expect(paths).toEqual([
      '.lux',
      '/home/runner/.local/share/lux',
      '/home/runner/.cache/lux'
    ])
  })

  test('linux xdg overrides', () => {
    const paths = cachePathsFor(
      'x86_64-linux',
      envFor('x86_64-linux', {
        HOME: '/home/runner',
        XDG_DATA_HOME: '/xdg/data',
        XDG_CACHE_HOME: '/xdg/cache'
      })
    )
    expect(paths).toEqual(['.lux', '/xdg/data/lux', '/xdg/cache/lux'])
  })

  test('macos', () => {
    const paths = cachePathsFor(
      'aarch64-macos',
      envFor('aarch64-macos', { HOME: '/Users/runner' })
    )
    expect(paths).toEqual([
      '.lux',
      '/Users/runner/Library/Application Support/org.lumenlabs.lux',
      '/Users/runner/Library/Caches/org.lumenlabs.lux'
    ])
  })

  test('windows', () => {
    const paths = cachePathsFor(
      'x86_64-windows',
      envFor('x86_64-windows', {
        LOCALAPPDATA: 'C:\\Users\\runner\\AppData\\Local'
      })
    )
    expect(paths).toEqual([
      '.lux',
      'C:\\Users\\runner\\AppData\\Local\\lumenlabs\\lux\\data',
      'C:\\Users\\runner\\AppData\\Local\\lumenlabs\\lux\\cache'
    ])
  })
})

describe('cacheSpecFor', () => {
  test('keys by target and resolved version', () => {
    const spec = cacheSpecFor(
      envFor('x86_64-linux', { HOME: '/home/runner' }),
      '0.43.5'
    )
    expect(spec.key).toBe('x86_64-linux-lux-0.43.5')
    expect(spec.restoreKeys).toEqual(['x86_64-linux-lux-'])
  })
})
