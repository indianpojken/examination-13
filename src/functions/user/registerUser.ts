import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import { z } from 'zod';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createResponse } from '../../utils/response.util.ts';

import { usersService } from '../../services/mod.ts';

import {
  validatorMiddleware,
  errorsMiddleware,
} from '../../middlewares/mod.ts';

import { usersValidation } from '../../validations/mod.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { username, password } = event.body as unknown as z.infer<
    typeof usersValidation.registerUser
  >;

  await usersService.registerUser(username, password);

  return createResponse(201, {
    status: 'success',
    data: null,
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(validatorMiddleware.validate(usersValidation.registerUser))
  .use(errorsMiddleware.errorHandler());
