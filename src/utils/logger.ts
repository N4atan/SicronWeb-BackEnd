const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';

export function error(...args: unknown[]) {
    if (!isProd) console.error(...args);
}

export function warn(...args: unknown[]) {
    if (!isProd) console.warn(...args);
}

export function info(...args: unknown[]) {
    if (!isProd) console.info(...args);
}

export function debug(...args: unknown[]) {
    if (!isProd) console.debug(...args);
}

export function table(data: unknown) {
    console.table(data);
}

const logger = {error, warn, info, debug, table};
export default logger;
