export const AuthenticationErrorStatusCodes = {
  'Unauthorized': 401
} as const

export class AuthenticationError extends Error {
  readonly code: keyof typeof AuthenticationErrorStatusCodes;
  constructor(code: keyof typeof AuthenticationErrorStatusCodes, opts?: ErrorOptions) {
    super(code, opts);
    this.code = code;
  }
}


export function assertAuthRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Unauthorized')
  }

  // TODO - JWT Verify and grab sub
  const token = authHeader.slice('Bearer '.length)
  return 'MOCK_SUB'
}