import { Elysia } from 'elysia'
import openapi, { fromTypes } from '@elysiajs/openapi';
import { errorPlugin } from './plugins/error-plugin';
import { authPlugin } from "./plugins/auth-plugin";
import { handleGenerateId } from "./handlers/handle-generate-id";

const authenticatedEndpoints = () => new Elysia({ name: 'authenticated-endpoints' })
    .use(errorPlugin)
    .use(authPlugin({ JWT_SECRET: 'JWT_SECRET' }))
    .get('api/v1/generate-id', async ({ user }) => handleGenerateId(user.sub))

const unauthenticatedEndpoints = () => new Elysia({ name: 'unauthenticated-endpoints' })
    .get('/', () => ({ name: 'friendly-id-api' }) as const)

export const app = new Elysia({ name: 'friendly-id-api' })
    .use(openapi({
        references: fromTypes('api/server.ts'),
    }))
    .use(unauthenticatedEndpoints)
    .use(authenticatedEndpoints)
    .listen(3000, ({ hostname, port }) => {
        console.log(`Server started on http://${hostname}:${port}`)
    })
