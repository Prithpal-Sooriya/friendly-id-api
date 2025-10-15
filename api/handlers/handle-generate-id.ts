import { generateId } from "../../mm-friendly-id";
import { insertId, TTL_CACHE_MS } from "../db/cache";
import { GenerateIdError } from "../errors/GenerateIdError";

export function handleGenerateId(userSub: string) {
    const exeuteInsert = () => {
        try {
            const id = generateId();
            insertId({ userSub, id })
            return id;
        } catch {
            return null;
        }
    }

    const successId = exeuteInsert() || exeuteInsert() || exeuteInsert()

    if (successId) {
        return new Response(
            JSON.stringify({ id: successId, expires_in: TTL_CACHE_MS / 1000 }),
            { headers: { "Content-Type": "application/json" } }
        );
    }

    throw new GenerateIdError('ID_Collision')
}
