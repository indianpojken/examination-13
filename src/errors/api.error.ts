import {
  ApiResponseData,
  ApiResponseFail,
  ApiResponseError,
} from '../types/api.type.ts';

import type { ErrorStatusCodes } from '../types/statusCodes.type.ts';

type ApiErrorOptions = Omit<ApiResponseError, 'status' | 'code'>; // code is set in constructor

type ApiFailOptions = Omit<ApiResponseFail, 'status'>;

class BaseApiError extends Error {
  code: ErrorStatusCodes;
  data: ApiResponseData;

  constructor(code: ErrorStatusCodes, options: ApiErrorOptions) {
    super(options.message);
    this.name = 'BaseApiError';
    this.code = code;
    this.data = options.data ?? null;
  }
}

export class ApiFail extends BaseApiError {
  constructor(code: ErrorStatusCodes, options: ApiFailOptions) {
    super(code, options as ApiErrorOptions);
    this.name = 'ApiFail';
  }
}

export class ApiError extends BaseApiError {
  constructor(code: ErrorStatusCodes, options: ApiErrorOptions) {
    super(code, options);
    this.name = 'ApiError';
  }
}
