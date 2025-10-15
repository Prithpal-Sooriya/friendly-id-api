import { Database } from "bun:sqlite";

// In Memory Cache DB
export const db = new Database();

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS id_cache (
  user_sub TEXT PRIMARY KEY,
  id TEXT UNIQUE,
  expires_at INTEGER
)
`);

export function cleanExpired() {
    db.run("DELETE FROM id_cache WHERE expires_at < ?", [Date.now()]);
}

export const TTL_CACHE_MS = 60 * 60 * 1000; // 1 Hour TTL
export function insertId(props: { userSub: string, id: string }) {
    const now = Date.now();
    db.run(`
        INSERT INTO id_cache (user_sub, id, expires_at)
        VALUES (?, ?, ?)
        ON CONFLICT (user_sub) DO UPDATE SET id = excluded.id
    `, [props.userSub, props.id, now + TTL_CACHE_MS]);
}

export const INTERVAL_MS = 5 * 60 * 1000; // 5 Minute Interval Expired TTL Cleanup
let interval: Timer | null = null;

export function startAutoClean() {
    if (interval) return;
    interval = setInterval(cleanExpired, INTERVAL_MS);
}

export function stopAutoClean() {
    if (interval) clearInterval(interval);
    interval = null;
}

if (process.env.NODE_ENV !== 'test') {
    startAutoClean()
}