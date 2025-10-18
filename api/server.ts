import { Elysia } from 'elysia'
import { errorPlugin } from './plugins/error-plugin';
import { authPlugin } from "./plugins/auth-plugin";
import { handleGenerateId } from "./handlers/handle-generate-id";

new Elysia()
    .use(errorPlugin)
    .use(authPlugin({ JWT_SECRET: 'JWT_SECRET' }))
    .get('/api/v1/generate-id', async ({ user }) => handleGenerateId(user.sub))
    .listen(3000)
