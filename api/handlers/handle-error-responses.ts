import { AuthenticationError, AuthenticationErrorStatusCodes } from '../errors/AuthenticationError'
import { GenerateIdError, GenerateIdErrorStatusCodes } from '../errors/GenerateIdError'

export function handleErrorResponses(err: unknown) {
  if (err instanceof AuthenticationError) {
    return new Response(err.code, { status: AuthenticationErrorStatusCodes[err.code] })
  }

  if (err instanceof GenerateIdError) {
    return new Response(err.code, { status: GenerateIdErrorStatusCodes[err.code] })
  }

  // Fallback if things went wrong
  return new Response('Something went wrong', { status: 500 })
}