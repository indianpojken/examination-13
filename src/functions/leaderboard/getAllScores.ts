import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createResponse } from '../../utils/response.util.ts';
import { leaderboardService } from '../../services/mod.ts';
import { errorsMiddleware } from '../../middlewares/mod.ts';
import { statusCodes } from '../../types/statusCodes.type.ts';

async function lambda(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const score = await leaderboardService.getAllScores();

  return createResponse(statusCodes.ok, {
    status: 'success',
    data: {
      leaderboard: await leaderboardService.createLeaderboardResponse(score),
    },
  });
}

export const handler = middy(lambda)
  .use(jsonBodyParser())
  .use(errorsMiddleware.errorHandler());
