import middy from '@middy/core';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ApiFail, ApiError } from '../errors/api.error.ts';
import { createResponse } from '../utils/response.util.ts';

export function errorHandler(): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> {
  return {
    onError: (request) => {
      const { error } = request;

      if (error instanceof ApiFail) {
        request.response = createResponse(error.code, {
          status: 'fail',
          data: error.data,
        });
      } else if (error instanceof ApiError) {
        request.response = createResponse(error.code, {
          status: 'error',
          message: error.message,
          ...(error.data && { data: error.data }),
        });
      } else if (error instanceof Error) {
        request.response = createResponse(400, {
          status: 'error',
          message: error.message,
        });
      } else {
        request.response = createResponse(500, {
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    },
  };
}
