import { AuthenticationError, AuthenticationErrorStatusCodes } from "../middleware/auth";

export function handleErrorResponses(err: unknown) {
  if (err instanceof AuthenticationError) {
    return new Response(err.code, { status: AuthenticationErrorStatusCodes[err.code] })
  }

  // Fallback if things went wrong
  return new Response('Something went wrong', { status: 500 })
}