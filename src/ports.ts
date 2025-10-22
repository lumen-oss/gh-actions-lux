// Adapter interfaces for IO

export type System = 'linux' | 'macos' | 'windows'
export type Arch = 'x86_64' | 'aarch64'

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
   * Detect the running system (normalized).
   * @returns one of 'linux' | 'macos' | 'windows'.
   */
  getSystem(): System

  /**
   * Detect the running architecture (normalized).
   * @returns one of 'x86_64' | 'aarch64'.
   */
  getArch(): Arch
}
