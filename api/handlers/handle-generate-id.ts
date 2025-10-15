import { generateId } from "../../mm-friendly-id";
import { insertId, TTL_CACHE_MS } from "../db/cache";

export function handleGenerateId(userSub: string) {
    const id = generateId();
    insertId({ userSub, id })
    return new Response(
        JSON.stringify({ id, expires_in: TTL_CACHE_MS / 1000 }),
        { headers: { "Content-Type": "application/json" } }
    );
}
