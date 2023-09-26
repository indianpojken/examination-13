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
import { statusCodes } from '../../types/statusCodes.type.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { username, password } = event.body as unknown as z.infer<
    typeof usersValidation.loginUser
  >;

  const token = await usersService.loginUser(username, password);

  return createResponse(statusCodes.ok, {
    status: 'success',
    data: { token },
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(validatorMiddleware.validate(usersValidation.loginUser))
  .use(errorsMiddleware.errorHandler());
