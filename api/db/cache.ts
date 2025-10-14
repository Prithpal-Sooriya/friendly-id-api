import { Database } from "bun:sqlite";

export const db = new Database("cache.db", { create: true });

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS id_cache (
  user_sub TEXT PRIMARY KEY,
  id TEXT,
  expires_at INTEGER
)
`);

export function cleanExpired() {
    db.run("DELETE FROM id_cache WHERE expires_at < ?", [Date.now()]);
}

export const TTL_CACHE_MS = 60 * 60 * 1000; // 1h
export function insertId(props: { userSub: string, id: string }) {
    const now = Date.now();
    db.run(
        "INSERT OR REPLACE INTO id_cache (user_sub, id, expires_at) VALUES (?, ?, ?)",
        [props.userSub, props.id, now + TTL_CACHE_MS]
    );
}

// Optional: call every few minutes
setInterval(cleanExpired, 5 * 60 * 1000);
