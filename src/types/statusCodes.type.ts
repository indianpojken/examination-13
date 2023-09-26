const informationStatusCodes = {
  continue: 100,
  switchingProtocols: 101,
  processing: 102,
  earlyHints: 103,
} as const;

const successStatusCodes = {
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multiStatus: 207,
  alreadyReported: 208,
  imUsed: 226,
} as const;

const redirectionStatusCodes = {
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  switchProxy: 306,
  temporaryRedirect: 307,
  permanentRedirect: 308,
} as const;

const clientErrorStatusCodes = {
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  uriTooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  teapot: 418,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  tooEarly: 425,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons: 451,
} as const;

const serverErrorStatusCodes = {
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,
} as const;

export const statusCodes = {
  ...informationStatusCodes,
  ...successStatusCodes,
  ...redirectionStatusCodes,
  ...clientErrorStatusCodes,
  ...serverErrorStatusCodes,
} as const;

type InformationStatusCodes =
  (typeof informationStatusCodes)[keyof typeof informationStatusCodes];

type SuccessStatusCodes =
  (typeof successStatusCodes)[keyof typeof successStatusCodes];

type RedirectionStatusCodes =
  (typeof redirectionStatusCodes)[keyof typeof redirectionStatusCodes];

type ClientErrorStatusCodes =
  (typeof clientErrorStatusCodes)[keyof typeof clientErrorStatusCodes];

type ServerErrorStatusCodes =
  (typeof serverErrorStatusCodes)[keyof typeof serverErrorStatusCodes];

export type StatusCodes =
  | InformationStatusCodes
  | SuccessStatusCodes
  | RedirectionStatusCodes
  | ClientErrorStatusCodes
  | ServerErrorStatusCodes;

export type ErrorStatusCodes = ClientErrorStatusCodes | ServerErrorStatusCodes;
