// Adapter interfaces for IO

import { ActionConfig } from './inputs.js'
import { LuxInstallerAsset, LuxRelease } from './lux.js'

export interface Handle {
  getConfig(): ActionConfig
  getEnv(): Env
  getLuxProvider(): LuxProvider
  getDownloader(): Downloader
  getFileSystem(): FileSystem
  getOS(): OS
  getCache(): Cache
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

  getTokenInput(): string | undefined

  getState(name: string): string | undefined
  saveState(name: string, value: string): void

  debug(message: string): void
  info(message: string): void
  warning(message: string): void

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

  /**
   * Prepends inputPath to the PATH.
   */
  addPath(inputPath: string): void

  /**
   * @returns an environment variable value, if present.
   */
  getEnvVar(name: string): string | undefined
}

export class LuxProviderError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'LuxProviderError'
  }
}

export interface LuxProvider {
  getRelease(): Promise<LuxRelease>
}

export interface FileSystem {
  readFile(path: string): Promise<Uint8Array>
  copyRecursive(src: string, dest: string): Promise<void>
  writeFile(path: string, data: Uint8Array): Promise<void>
  mkdtemp(prefix: string): Promise<string>
  /**
   * Tests a user's permissions for reading the file or directory specified by `path`.
   * Throws if the file cannot be read.
   */
  access_read(path: string): Promise<void>
  readdir(path: string): Promise<string[]>
  /**
   * See the POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html)
   */
  unlink(path: string): Promise<void>
}

export interface OS {
  exec(commandLine: string, args?: string[]): Promise<number>
}

export interface Downloader {
  download_installer_asset(
    asset: LuxInstallerAsset,
    destPath: string
  ): Promise<void>
}

export type CacheSpec = {
  paths: string[]
  key: string
  restoreKeys: string[]
}

export interface Cache {
  /**
   * @returns the key of the restored cache, or undefined on a miss.
   */
  restore(spec: CacheSpec): Promise<string | undefined>
  save(spec: CacheSpec): Promise<void>
}
