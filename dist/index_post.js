import { a as cacheSpecFor, c as createGitHubActionsHandle } from './handle-CeK-3J1E.js';
import 'path';
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
import 'node:module';
import 'string_decoder';
import 'child_process';
import 'timers';
import 'stream';
import 'url';
import 'tty';
import 'buffer';
import 'querystring';
import 'stream/web';
import 'worker_threads';
import 'perf_hooks';
import 'util/types';
import 'async_hooks';
import 'console';
import 'zlib';
import 'diagnostics_channel';
import 'fs/promises';

async function run_post(handle) {
    const env = handle.getEnv();
    const version = env.getState('lux_version');
    if (!version)
        return;
    await handle.getCache().save(cacheSpecFor(env, version));
}

const handle = createGitHubActionsHandle();
/* istanbul ignore next */
run_post(handle);
//# sourceMappingURL=index_post.js.map
