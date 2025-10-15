import { describe, expect, it } from 'bun:test'
import { handleErrorResponses } from './handle-error-responses'
import { AuthenticationError, AuthenticationErrorStatusCodes } from '../errors/AuthenticationError'
import { GenerateIdError, GenerateIdErrorStatusCodes } from '../errors/GenerateIdError'


describe(handleErrorResponses.name, () => {
  it('handles AuthenticationErrors', () => {
    Object.entries(AuthenticationErrorStatusCodes).forEach(([key, val]) => {
      const response = handleErrorResponses(new AuthenticationError(key as keyof typeof AuthenticationErrorStatusCodes))
      expect(response.status).toBe(val)
    })
  })

  it('handles GenerateIdErrors', () => {
    Object.entries(GenerateIdErrorStatusCodes).forEach(([key, val]) => {
      const response = handleErrorResponses(new GenerateIdError(key as keyof typeof GenerateIdErrorStatusCodes))
      expect(response.status).toBe(val)
    })
  })

  it('handles unexpected errors', () => {
    const response = handleErrorResponses(new Error('Unknown & unhandled error'))
    expect(response.status).toBe(500)
  })
})