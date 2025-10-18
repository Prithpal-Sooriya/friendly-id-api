import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { AuthenticationError } from "../errors/AuthenticationError";

export const authPlugin = (props: { JWT_SECRET: string }) => () => new Elysia({ name: 'auth-plugin' })
  .use(bearer())
  .use(jwt({
    secret: props.JWT_SECRET
  }))
  .derive(async ({ bearer, jwt }) => {
    if (!bearer) {
      throw new AuthenticationError('Unauthorized')
    }

    const payload = await jwt.verify(bearer);
    if (!payload || !payload.sub) {
      throw new AuthenticationError('Unauthorized')
    }

    return {
      user: {
        sub: payload.sub
      }
    }
  })
