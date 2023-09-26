import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createResponse } from '../../utils/response.util.ts';
import { quizService } from '../../services/mod.ts';

import {
  authorizeMiddleware,
  errorsMiddleware,
} from '../../middlewares/mod.ts';

import { statusCodes } from '../../types/statusCodes.type.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const removedQuiz = await quizService.deleteQuizById(
    event.auth.userId,
    event.pathParameters?.quizId as string
  );

  return createResponse(statusCodes.created, {
    status: 'success',
    data: { quiz: quizService.createQuizResponse(removedQuiz) },
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(authorizeMiddleware.authorize())
  .use(errorsMiddleware.errorHandler());
