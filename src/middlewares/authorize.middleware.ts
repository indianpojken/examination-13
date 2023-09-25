import middy from '@middy/core';
import jwt from 'jsonwebtoken';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ApiError } from '../errors/api.error.ts';

export function authorize(): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> {
  return {
    before: async (request) => {
      const token = request.event.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError(401, { message: 'Missing token: login required' });
      }

      request.event.auth = jwt.verify(token, process.env.JWT_SECRET as string);
    },
  };
}
