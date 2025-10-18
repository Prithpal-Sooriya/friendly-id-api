import { generateId } from "../../mm-friendly-id";
import { insertId, TTL_CACHE_MS } from "../db/cache";
import { GenerateIdError } from "../errors/GenerateIdError";

export function handleGenerateId(userSub: string) {
    const exeuteInsert = () => {
        try {
            const id = generateId();
            return insertId({ userSub, id })
        } catch {
            return null;
        }
    }

    const result = exeuteInsert() || exeuteInsert() || exeuteInsert()

    if (result && result.id && result.expiresAt) {
        return { id: result.id, expiresAt: result.expiresAt }
    }

    throw new GenerateIdError('ID_Collision')
}
