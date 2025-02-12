export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  NOT_PROCESSED: 422,
  INTERNAL_ERROR: 500,
} as const;

export type HttpStatusCodeType = typeof HttpStatusCode[keyof typeof HttpStatusCode];
