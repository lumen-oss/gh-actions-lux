/* eslint-disable @typescript-eslint/no-unused-vars */

import type { OS } from '../../src/ports.js'

export class MockOS implements OS {
  async exec(_commandLine: string, _args?: string[]): Promise<number> {
    return 0
  }
}
