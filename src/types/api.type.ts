export type ApiResponseData = object | null;

export interface ApiResponseSuccess {
  status: 'success';
  data: ApiResponseData;
}

export interface ApiResponseFail {
  status: 'fail';
  data: ApiResponseData;
}

export interface ApiResponseError {
  status: 'error';
  message: string;
  code?: number;
  data?: ApiResponseData;
}

export type ApiResponse =
  | ApiResponseSuccess
  | ApiResponseFail
  | ApiResponseError;
