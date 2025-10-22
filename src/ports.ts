// Adapter interfaces for IO

export type Target =
  | 'x86_64-linux'
  | 'aarch64-linux'
  | 'aarch64-macos'
  | 'x86_64-windows'

export class UnsupportedTarget extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnsupportedTarget'
  }
}

export interface Env {
  /**
   * Get an action input by name.
   */
  getInput(name: string): string | undefined

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
   * - 'x86-64-linux'
   * - 'aarch64-macos'
   * - 'x86-64-windows'
   */
  getTarget(): Target
}
