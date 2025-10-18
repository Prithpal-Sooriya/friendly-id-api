export const GenerateIdErrorStatusCodes = {
  'ID_Collision': 409 // Conflict
} as const

export class GenerateIdError extends Error {
  readonly code: keyof typeof GenerateIdErrorStatusCodes;
  readonly status: typeof GenerateIdErrorStatusCodes[keyof typeof GenerateIdErrorStatusCodes]
  constructor(code: keyof typeof GenerateIdErrorStatusCodes, opts?: ErrorOptions) {
    super(code, opts);
    this.code = code;
    this.status = GenerateIdErrorStatusCodes[code]
  }
}