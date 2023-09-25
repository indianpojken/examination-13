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
  const question = event.body as unknown as z.infer<
    typeof quizValidation.addQuestion
  >;

  await quizService.addQuestionToQuiz(
    event.auth.userId,
    event.pathParameters?.quizId as string,
    question
  );

  return createResponse(201, {
    status: 'success',
    data: null,
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(authorizeMiddleware.authorize())
  .use(validatorMiddleware.validate(quizValidation.addQuestion))
  .use(errorsMiddleware.errorHandler());
