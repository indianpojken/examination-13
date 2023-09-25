import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createResponse } from '../../utils/response.util.ts';

import { quizService } from '../../services/mod.ts';

import { errorsMiddleware } from '../../middlewares/mod.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const quizes = await quizService.getAllQuizes();

  return createResponse(200, {
    status: 'success',
    data: {
      quizes: quizes.map((quiz) => quizService.createQuizResponse(quiz)),
    },
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(errorsMiddleware.errorHandler());
