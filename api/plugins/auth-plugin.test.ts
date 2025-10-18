import { describe, expect, it, mock } from 'bun:test';
import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { errorPlugin } from './error-plugin';
import { authPlugin } from './auth-plugin';
import { AuthenticationErrorStatusCodes } from '../errors/AuthenticationError';

const signApp = () => new Elysia()
  .use(jwt({ secret: 'JWT_SECRET' }))
  .get('/test-sign', ({ jwt }) => jwt.sign({ sub: '1111' }))

const authApp = () => new Elysia()
  .use(errorPlugin)
  .use(authPlugin({ JWT_SECRET: 'JWT_SECRET' }))
  .get('/test', ({ user }) => {
    return { message: 'Authenticated', userSub: user.sub };
  });

describe(authPlugin.name, () => {
  it('returns Unauthorized response when no Authorization header added', async () => {
    const response = await authApp()
      .handle(new Request('http://localhost/test')); // No 'Authorization' header

    expect(response.status).toBe(AuthenticationErrorStatusCodes.Unauthorized);
    expect(await response.text()).toBe('Unauthorized');
  });

  it('returns Unauthorized when Authorization header token is invalid', async () => {
    const response = await authApp()
      .handle(new Request('http://localhost/test', {
        headers: {
          'Authorization': 'Bearer NOT.A.VALID.TOKEN'
        }
      }));

    expect(response.status).toBe(AuthenticationErrorStatusCodes.Unauthorized);
    expect(await response.text()).toBe('Unauthorized');
  });

  it('Successfully derives `user` context when given a valid Authorization header', async () => {
    // Generate a registration token
    const signInResp = await signApp().handle(new Request('http://localhost/test-sign'))
    const token = await signInResp.text()

    // Use reg token for this response
    const response = await authApp()
      .handle(new Request('http://localhost/test', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      message: 'Authenticated',
      userSub: '1111'
    })
  });
});