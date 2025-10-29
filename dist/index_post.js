import { G as GitHubActionsHandle } from './handle-BV5Fssw8.js';
import 'os';
import 'crypto';
import 'fs';
import 'path';
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

async function run_post(handle) {
    handle = handle ?? new GitHubActionsHandle();
    const env = handle.getEnv();
    const cache = handle.getCache();
    const version = env.getVersionInput();
    await cache.save(version);
}

/* istanbul ignore next */
run_post();
//# sourceMappingURL=index_post.js.map
