// Adapter interfaces for IO

import { LuxInstallerAsset, LuxRelease } from './lux.js'

export interface Handle {
  getEnv(): Env
  getLuxProvider(): LuxProvider
  getDownloader(): Downloader
  getFileSystem(): FileSystem
  getInstaller(): Installer
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

export interface FileSystem {
  readFile(path: string): Promise<Uint8Array>
  writeFile(path: string, data: Uint8Array): Promise<void>
  mkdtemp(prefix: string): Promise<string>
}

export interface Downloader {
  download_installer_asset(
    fs: FileSystem,
    asset: LuxInstallerAsset,
    destPath: string
  ): Promise<void>
}

export interface Installer {
  install(assetPath: string): Promise<void>
}
