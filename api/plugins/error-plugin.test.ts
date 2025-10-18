import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { errorPlugin } from './error-plugin';
import { AuthenticationError, AuthenticationErrorStatusCodes } from '../errors/AuthenticationError';
import { GenerateIdError, GenerateIdErrorStatusCodes } from '../errors/GenerateIdError';

const app = () => new Elysia()
  .use(errorPlugin())

describe(errorPlugin.name, () => {
  it('handles AuthenticationErrors', async () => {
    const tests = Object.entries(AuthenticationErrorStatusCodes).map(async ([key, val]) => {
      const response = await app()
        .get('auth-fail', () => {
          throw new AuthenticationError(key as keyof typeof AuthenticationErrorStatusCodes)
        })
        .handle(new Request('http://localhost/auth-fail'))
      expect(response.status).toBe(val)
    })

    await Promise.all(tests)
  })

  it('handles GenerateIdErrors', async () => {
    const tests = Object.entries(GenerateIdErrorStatusCodes).map(async ([key, val]) => {
      const response = await app()
        .get('generate-id-fail', () => {
          throw new GenerateIdError(key as keyof typeof GenerateIdErrorStatusCodes)
        })
        .handle(new Request('http://localhost/generate-id-fail'))
      expect(response.status).toBe(val)
    })

    await Promise.all(tests)
  })

  it('should handle an unregistered Error and return 500', async () => {
    const response = await app()
      .get('unknown-fail', () => {
        throw new Error('Unknown error')
      })
      .handle(new Request('http://localhost/unknown-fail'));

    // Unregistered errors should fall through to Elysia's default internal error handler,
    // which returns 500.
    expect(response.status).toBe(500);
  });
});