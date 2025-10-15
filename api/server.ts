import { handleGenerateId } from "./handlers/handle-generate-id";
import { assertAuthRequest } from "./middleware/auth";
import { handleErrorResponses } from "./handlers/handle-error-responses";

// TODO:
// - Add authentication middleware (mostly done, need to add JWT verification)
// - Add tests

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        try {
            const url = new URL(request.url);
            if (url.pathname === "/api/generate-id" && request.method === "POST") {
                const sub = assertAuthRequest(request)
                return handleGenerateId(sub)
            }
            return new Response("Not found", { status: 404 });
        } catch (err) {
            return handleErrorResponses(err)
        }

    },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
