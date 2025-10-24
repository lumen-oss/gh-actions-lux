// Adapter interfaces for IO

import { LuxRelease } from './lux.js'

export interface Handle {
  getEnv(): Env
  getLuxProvider(): LuxProvider
}

export type Target =
  | 'x86_64-linux'
  | 'aarch64-linux'
  | 'aarch64-macos'
  | 'x86_64-windows'

export class UnsupportedTargetError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnsupportedTargetError'
  }
}

export interface Env {
  /**
   * Get an action input by name.
   */
  getVersionInput(): string

  debug(message: string): void
  info(message: string): void

  /**
   * Mark the action as failed.
   */
  setFailed(message: string): void

  /**
   * @returns the normalized target for the running environment.
   * One of:
   * - 'aarch64-linux'
   * - 'x86_64-linux'
   * - 'aarch64-macos'
   * - 'x86_64-windows'
   */
  getTarget(): Target
}

export class LuxProviderError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'LuxProviderError'
  }
}

export interface LuxProvider {
  getRelease(version: string): Promise<LuxRelease>
}
