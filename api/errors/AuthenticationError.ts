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