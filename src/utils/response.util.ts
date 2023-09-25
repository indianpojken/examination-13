import type { APIGatewayProxyResult } from 'aws-lambda';

import type { ApiResponse } from '../types/api.type.ts';
import type { StatusCodes } from '../types/statusCodes.type.ts';

export function createResponse(
  code: StatusCodes,
  response: ApiResponse
): APIGatewayProxyResult {
  return {
    statusCode: code,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
}
