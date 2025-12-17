/**
 * Simple in-memory Redis-like client used for development/tests when
 * no external Redis server is available.
 *
 * This implementation provides a minimal subset of the Redis client
 * API used in this project:
 * - `connect()` / `quit()` lifecycle
 * - `get(key)`, `set(key, value, mode?, ttl?)`, `del(...keys)`,
 * `expire(key, seconds)`
 * - `hget(hash, field)`, `hset(hash, field, value)`
 * - compatibility helpers: `setex(key, seconds, value)` and
 * `scanStream({match, count})`
 *
 * The goal is compatibility for the project's needs (not a full Redis
 * implementation). Methods return values resembling `node-redis`
 * where reasonable (e.g. `set` returns `'OK'`).
 */
import {EventEmitter} from 'events';

export default class InMemoriaRedis
{
    private store = new Map<string, string>();
    private timers = new Map<string, NodeJS.Timeout>();

    constructor()
    {}

    async connect(): Promise<void>
    {
        return;
    }

    async quit(): Promise<void>
    {
        for (const t of this.timers.values()) clearTimeout(t);
        this.timers.clear();
        this.store.clear();
    }

    private setTTL(key: string, seconds: number)
    {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key)!);
        }
        const t = setTimeout(() => {
            this.store.delete(key);
            this.timers.delete(key);
        }, seconds * 1000);
        this.timers.set(key, t);
    }

    async get(key: string): Promise<string|null>
    {
        const v = this.store.get(key);
        return v === undefined ? null : v;
    }

    /**
     * Set a key. Accepts both Redis-style `set(key, value, 'EX',
     * seconds)` and local `set(key, value, undefined, seconds)`
     * usages.
     */
    async set(
        key: string,
        value: string,
        mode?: string|null,
        ttlSeconds?: number): Promise<'OK'|null>
    {
        this.store.set(key, value);
        if ((mode === 'EX' || !!ttlSeconds) && ttlSeconds &&
            ttlSeconds > 0) {
            this.setTTL(key, ttlSeconds);
        }
        return 'OK';
    }

    /** Delete keys, returning number of removed keys. */
    async del(...keys: string[]): Promise<number>
    {
        let removed = 0;
        for (const k of keys) {
            if (this.store.delete(k)) {
                removed++;
            }
            if (this.timers.has(k)) {
                clearTimeout(this.timers.get(k)!);
                this.timers.delete(k);
            }
        }
        return removed;
    }

    async expire(key: string, seconds: number): Promise<number>
    {
        if (!this.store.has(key)) return 0;
        this.setTTL(key, seconds);
        return 1;
    }

    async hget(hash: string, field: string): Promise<string|null>
    {
        const key = `${hash}::${field}`;
        return this.get(key);
    }

    async hset(hash: string, field: string, value: string):
        Promise<number>
    {
        const key = `${hash}::${field}`;
        const exists = this.store.has(key) ? 0 : 1;
        this.store.set(key, value);
        return exists;
    }

    /**
     * Compatibility: setex(key, seconds, value)
     */
    async setex(key: string, seconds: number, value: string):
        Promise<'OK'|null>
    {
        return this.set(key, value, 'EX', seconds);
    }

    /**
     * Compatibility: simple scanStream implementation that emits
     * 'data' with arrays of matching keys and then 'end'. Options
     * supports `{match, count}`.
     */
    scanStream(options?: {match?: string; count?: number}):
        EventEmitter
    {
        const ee = new EventEmitter();
        const match = options?.match || '*';
        const count = options?.count || 1000;

        // Convert simple glob (`*`) to RegExp
        const escaped = match.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&')
                            .replace(/\\\*/g, '.*');
        const re = new RegExp('^' + escaped + '$');

        setImmediate(() => {
            try {
                const keys: string[] = [];
                for (const k of this.store.keys()) {
                    if (re.test(k)) keys.push(k);
                }

                // Emit in one or more chunks depending on `count`
                for (let i = 0; i < keys.length; i += count) {
                    const chunk = keys.slice(i, i + count);
                    ee.emit('data', chunk);
                }
                ee.emit('end');
            } catch (err) {
                ee.emit('error', err);
            }
        });

        return ee;
    }
}