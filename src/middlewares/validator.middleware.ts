import { z } from 'zod';
import middy from '@middy/core';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ApiFail } from '../errors/api.error.ts';

function formatZodError(error: z.ZodError) {
  return error.errors.map((e) => ({ [e.path.at(0) as string]: e.message }));
}

export function validate(
  validation: z.ZodSchema
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  return {
    before: async (request) => {
      try {
        await validation.parseAsync(request.event.body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ApiFail(400, { data: formatZodError(error) });
        }
      }
    },
  };
}
