import { describe, it, expect } from 'bun:test'
import { assertAuthRequest } from './auth'
import { AuthenticationError } from '../errors/AuthenticationError'


describe(assertAuthRequest.name, () => {
  it('throws authentication error on missing or invalid `authorization` headers', () => {
    // Missing Header
    expect(() => assertAuthRequest(new Request('https://www.google.com', {
      headers: {
        'Missing-Auth-Header': 'true'
      }
    }))).toThrow(new AuthenticationError('Unauthorized'))

    // Invalid Header
    expect(() => assertAuthRequest(new Request('https://www.google.com', {
      headers: {
        'authorization': 'does not start with bearer:'
      }
    }))).toThrow(new AuthenticationError('Unauthorized'))
  })
})