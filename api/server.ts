import { generateId } from "../mm-friendly-id";
// import { requireAuth } from "./middleware/auth";

// TODO:
// - Add handler to generate ID
// - Add authentication middleware
// - Add tests

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/api/generate-id" && req.method === "POST") {
            // const subOrRes = await requireAuth(req);
            // if (typeof subOrRes !== "string") return subOrRes;
            // return handleGenerateId(req, subOrRes);
        }

        return new Response("Not found", { status: 404 });
    },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
