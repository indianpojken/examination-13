// prettier-ignore
export type InformationStatusCodes =
  | 100 | 101| 102 | 103

// prettier-ignore
export type SuccessStatusCodes =
  | 200 | 201 | 202 | 203 | 204
  | 205 | 206 | 207 | 208 | 226

// prettier-ignore
export type ClientErrorStatusCodes =
  | 400 | 401 | 402 | 403 | 404 
  | 405 | 406 | 407 | 408 | 409
  | 411 | 412 | 413 | 414 | 415 
  | 416 | 417 | 418 | 421 | 422
  | 423 | 424 | 425 | 426 | 428 
  | 429 | 431 | 451;

// prettier-ignore
export type ServerErrorStatusCodes =
  | 500 | 501 | 502 | 503 | 504 
  | 505 | 506 | 507 | 508 | 510
  | 511;

export type StatusCodes =
  | InformationStatusCodes
  | SuccessStatusCodes
  | ClientErrorStatusCodes
  | ServerErrorStatusCodes;

export type ErrorStatusCodes = ClientErrorStatusCodes | ServerErrorStatusCodes;
