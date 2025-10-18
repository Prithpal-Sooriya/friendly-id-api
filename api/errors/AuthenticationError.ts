export const AuthenticationErrorStatusCodes = {
  'Unauthorized': 401
} as const

export class AuthenticationError extends Error {
  readonly code: keyof typeof AuthenticationErrorStatusCodes;
  readonly status: typeof AuthenticationErrorStatusCodes[keyof typeof AuthenticationErrorStatusCodes]
  constructor(code: keyof typeof AuthenticationErrorStatusCodes, opts?: ErrorOptions) {
    super(code, opts);
    this.code = code;
    this.status = AuthenticationErrorStatusCodes[code]
  }
}