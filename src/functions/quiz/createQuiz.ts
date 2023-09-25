import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import { z } from 'zod';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createResponse } from '../../utils/response.util.ts';

import { quizService } from '../../services/mod.ts';

import {
  authorizeMiddleware,
  validatorMiddleware,
  errorsMiddleware,
} from '../../middlewares/mod.ts';

import { quizValidation } from '../../validations/mod.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const quiz = event.body as unknown as z.infer<
    typeof quizValidation.createQuiz
  >;

  const id = await quizService.createQuiz(event.auth.userId, quiz.name);

  return createResponse(201, {
    status: 'success',
    data: { id },
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(authorizeMiddleware.authorize())
  .use(validatorMiddleware.validate(quizValidation.createQuiz))
  .use(errorsMiddleware.errorHandler());
