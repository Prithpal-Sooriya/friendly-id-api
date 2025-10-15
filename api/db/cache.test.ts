import { describe, it, expect, setSystemTime, beforeEach } from "bun:test";
import * as CacheModule from './cache'

const FIXED_START_TIME = new Date("2025-10-15T09:00:00.000Z");

async function freshCacheModule() {
    // Ensure the new module is loaded fresh for each test
    const module = await import('./cache');
    return {
        ...module,
        testUtils: {
            getTable: () =>
                module.db
                    .query(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name='id_cache'"
                    )
                    .get() as { name: string },
            getItem: (user_sub: string) =>
                module.db
                    .query("SELECT * FROM id_cache WHERE user_sub = ?")
                    .get(user_sub) as
                | { id: string; user_sub: string; expires_at: number }
                | null,
        },
    };
}

// it test wrapper to use fresh modules + test utils
function itFresh(
    name: string,
    fn: (cache: Awaited<ReturnType<typeof freshCacheModule>>) => void | Promise<void>
) {
    it(name, async () => {
        const cache = await freshCacheModule();
        await fn(cache);
    });
}

describe("db/cache tests", () => {
    beforeEach(() => setSystemTime(FIXED_START_TIME))

    itFresh("creates the id_cache table on import", (cache) => {
        const result = cache.testUtils.getTable();
        expect(result.name).toBe("id_cache");
    });

    itFresh(`${CacheModule.insertId.name} - inserts and overwrites correctly`, (cache) => {
        cache.insertId({ userSub: "user-123", id: "MM-foo-123" });
        const row1 = cache.testUtils.getItem("user-123");
        expect(row1).toStrictEqual({
            id: 'MM-foo-123',
            user_sub: 'user-123',
            expires_at: FIXED_START_TIME.getTime() + cache.TTL_CACHE_MS
        })

        cache.insertId({ userSub: "user-123", id: "MM-bar-123" });
        const row2 = cache.testUtils.getItem("user-123");
        expect(row2?.id).toBe("MM-bar-123"); // overwritten to MM-bar-123
    });

    itFresh(`${CacheModule.insertId.name} - throws if ID is not unique`, (cache) => {
        // First user inserts with ID
        cache.insertId({ userSub: "user-123", id: "MM-foo-123" });
        const row1 = cache.testUtils.getItem("user-123");
        expect(row1?.id).toBe('MM-foo-123')

        // Second user inserts with same ID (not unique)
        // Throws error and is not inserted
        expect(() => cache.insertId({ userSub: 'user-234', id: 'MM-foo-123' })).toThrowError('UNIQUE constraint failed: id_cache.id')
        const row2 = cache.testUtils.getItem("user-234");
        expect(row2).toBeNull()
    });

    itFresh(`${CacheModule.cleanExpired.name} - removes expired items`, (cache) => {
        cache.insertId({ userSub: "user-123", id: "token-to-expire" });
        expect(cache.testUtils.getItem('user-123')).toBeDefined();

        // Advance clock past 1-hour TTL (+1h, +1m)
        const expiredTime = new Date(FIXED_START_TIME.getTime());
        expiredTime.setHours(expiredTime.getHours() + 1);
        expiredTime.setMinutes(expiredTime.getMinutes() + 1);
        setSystemTime(expiredTime);

        cache.cleanExpired();
        expect(cache.testUtils.getItem("user-123")).toBeNull();
    });
});