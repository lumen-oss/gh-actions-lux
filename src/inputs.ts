import type { Env } from './ports.ts'

export type ActionConfig = {
  version: string
}

/**
 * Normalize action inputs into a typed config.
 */
function parseActionInputs(
  raw: Record<string, string | undefined>
): ActionConfig {
  return {
    version: raw['version'] ?? 'latest'
  }
}

export function collectConfig(env: Env): ActionConfig {
  const rawInputs: Record<string, string | undefined> = {
    version: env.getVersionInput()
  }
  return parseActionInputs(rawInputs)
}
