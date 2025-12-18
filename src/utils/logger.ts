import {inspect} from 'util';

const env = (process.env.NODE_ENV || '').toLowerCase();
const isProd = env === 'production';

type LogLevel = 'error'|'warn'|'info'|'debug'|'table';

// Lightweight async queue to avoid blocking main thread on heavy
// logging.
const queue: Array<() => void> = [];
let draining = false;

function enqueue(fn: () => void)
{
    queue.push(fn);
    if (!draining) {
        draining = true;
        // Flush on next tick so logging is non-blocking.
        setImmediate(() => {
            try {
                while (queue.length) {
                    const work = queue.shift();
                    if (work) work();
                }
            } finally {
                draining = false;
            }
        });
    }
}

function formatArgs(args: unknown[])
{
    return args
        .map(
            a => (typeof a === 'string' ? a : inspect(a, {depth: 2})))
        .join(' ');
}

function makeLogger(level: LogLevel)
{
    return (...args: unknown[]) => {
        // In production prefer minimal overhead: only enqueue
        // critical logs.
        if (isProd && level === 'debug') return;

        const payload = formatArgs(args);

        // In prod write via setImmediate to avoid sync I/O impact.
        enqueue(() => {
            switch (level) {
                case 'error':
                    console.error(payload);
                    break;
                case 'warn':
                    console.warn(payload);
                    break;
                case 'info':
                    console.info(payload);
                    break;
                case 'debug':
                    // debug only logs when not production
                    if (!isProd) console.debug(payload);
                    break;
                case 'table':
                    // table may be expensive; only run when not prod
                    if (!isProd) console.table(args[0]);
                    break;
            }
        });
    };
}

const error = makeLogger('error');
const warn = makeLogger('warn');
const info = makeLogger('info');
const debug = makeLogger('debug');
const table = (data: unknown) => makeLogger('table')(data);

const logger = {
    error,
    warn,
    info,
    debug,
    table
};
export default logger;
