import { AuthenticationError } from "../errors/AuthenticationError";

export function assertAuthRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Unauthorized')
  }

  // TODO - JWT Verify and grab sub
  const token = authHeader.slice('Bearer '.length)
  return 'MOCK_SUB'
}