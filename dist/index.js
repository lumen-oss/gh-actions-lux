import { U as UnsupportedTargetError, G as GitHubActionsHandle } from './handle-BV5Fssw8.js';
import { join } from 'path';
import 'os';
import 'crypto';
import 'fs';
import 'http';
import 'https';
import 'net';
import 'tls';
import 'events';
import 'assert';
import 'util';
import 'stream';
import 'buffer';
import 'querystring';
import 'stream/web';
import 'node:module';
import 'worker_threads';
import 'perf_hooks';
import 'util/types';
import 'async_hooks';
import 'console';
import 'url';
import 'zlib';
import 'string_decoder';
import 'diagnostics_channel';
import 'child_process';
import 'timers';
import 'tty';
import 'fs/promises';

/**
 * Normalize action inputs into a typed config.
 */
function parseActionInputs(raw) {
    return {
        version: raw['version'] ?? 'latest'
    };
}
function collectConfig(env) {
    const rawInputs = {
        version: env.getVersionInput()
    };
    return parseActionInputs(rawInputs);
}

function createInstaller(handle) {
    const env = handle.getEnv();
    switch (env.getTarget()) {
        case 'x86_64-linux':
        case 'aarch64-linux':
            return createDebInstaller(handle.getFileSystem(), handle.getOS());
        case 'aarch64-macos':
            return createDmgInstaller(env, handle.getFileSystem(), handle.getOS());
        case 'x86_64-windows':
            return createExeInstaller(env, handle.getFileSystem(), handle.getOS());
        default:
            throw new UnsupportedTargetError(`no installer available for target: ${String(env.getTarget())}`);
    }
}
class DebInstaller {
    filesystem;
    os;
    constructor(fs, os) {
        this.filesystem = fs;
        this.os = os;
    }
    async install(assetPath) {
        await this.filesystem.access_read(assetPath);
        await this.os.exec('sudo', ['dpkg', '-i', assetPath]);
    }
}
function createDebInstaller(fs, os) {
    return new DebInstaller(fs, os);
}
class DmgInstaller {
    env;
    filesystem;
    os;
    constructor(env, fs, os) {
        this.env = env;
        this.filesystem = fs;
        this.os = os;
    }
    async install(assetPath) {
        await this.filesystem.access_read(assetPath);
        const workDir = await this.filesystem.mkdtemp('lux-dmg-');
        // We need to convert to UDTO, to prevent a prompt to accept the license.
        const converted = join(workDir, 'converted.cdr');
        const mountPoint = '/Volumes/install_app';
        let mounted = false;
        try {
            await this.os.exec('hdiutil', [
                'convert',
                '-quiet',
                assetPath,
                '-format',
                'UDTO',
                '-o',
                converted
            ]);
            await this.os.exec('hdiutil', [
                'attach',
                '-nobrowse',
                '-noverify',
                '-mountpoint',
                mountPoint,
                converted
            ]);
            mounted = true;
            const entries = await this.filesystem.readdir(mountPoint);
            const app = entries.find((e) => e.endsWith('.app'));
            if (!app)
                throw new Error(`no .app bundle found at ${mountPoint}`);
            const src = join(mountPoint, app);
            await this.filesystem.copyRecursive(src, '/Applications/');
            const lx_app_dir = join('/Applications', app, 'Contents', 'MacOS');
            this.env.addPath(lx_app_dir);
        }
        finally {
            if (mounted) {
                try {
                    await this.os.exec('hdiutil', ['detach', mountPoint]);
                }
                catch {
                    /* best-effort */
                }
            }
            else {
                try {
                    await this.os.exec('hdiutil', ['detach', workDir]);
                }
                catch {
                    /* best-effort */
                }
            }
            try {
                await this.filesystem.unlink(converted);
            }
            catch {
                /* ignore cleanup errors */
            }
        }
    }
}
function createDmgInstaller(env, fs, os) {
    return new DmgInstaller(env, fs, os);
}
class ExeInstaller {
    env;
    filesystem;
    os;
    constructor(env, fs, os) {
        this.env = env;
        this.filesystem = fs;
        this.os = os;
    }
    async install(assetPath) {
        await this.filesystem.access_read(assetPath);
        const installDir = join('c:', 'Program Files', 'lux');
        try {
            await this.os.exec('powershell.exe', [
                '-NoProfile',
                '-WindowStyle',
                'Hidden',
                'Start-Process',
                assetPath,
                '-Wait',
                '-ArgumentList',
                `/P, /D="${installDir}"`
            ]);
        }
        catch (err) {
            throw new Error(`failed to perform silent install for ${assetPath}:\n\n${err}`);
        }
        this.env.addPath(installDir);
    }
}
function createExeInstaller(env, fs, os) {
    return new ExeInstaller(env, fs, os);
}

async function run(handle) {
    handle = handle ?? new GitHubActionsHandle();
    const env = handle.getEnv();
    const lux_provider = handle.getLuxProvider();
    const filesystem = handle.getFileSystem();
    const downloader = handle.getDownloader();
    const cache = handle.getCache();
    try {
        const config = collectConfig(env);
        env.debug(`Parsed inputs: ${JSON.stringify(config)}`);
        env.debug(`Running on ${env.getTarget()}`);
        const version = env.getVersionInput();
        await cache.restore(version);
        const lux_release = await lux_provider.getRelease(version);
        const installer_asset = lux_release.assetForTarget(env.getTarget());
        env.info(`Found installer release asset: ${JSON.stringify(installer_asset)}`);
        env.info(`Downloading Lux ${lux_release.version} installer...`);
        const tmpDir = await filesystem.mkdtemp('lux-');
        const installer_asset_path = join(tmpDir, installer_asset.file_name);
        await downloader.download_installer_asset(installer_asset, installer_asset_path);
        env.info(`Downloaded ${installer_asset.file_name} to ${installer_asset_path}`);
        env.info(`Installing Lux ${lux_release.version}...`);
        const installer = createInstaller(handle);
        await installer.install(installer_asset_path);
        env.info('Done.');
    }
    catch (error) {
        if (error instanceof Error) {
            env.setFailed(error.message);
        }
        else {
            env.setFailed(`unexpected error: ${JSON.stringify(error)}`);
        }
    }
}

/* istanbul ignore next */
run();
//# sourceMappingURL=index.js.map
