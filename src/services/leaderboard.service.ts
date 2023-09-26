import { nanoid } from 'nanoid';

import { database } from './database.service.ts';
import { ApiError } from '../errors/api.error.ts';
import { quizService, usersService } from './mod.ts';
import { statusCodes } from '../types/statusCodes.type.ts';

interface ScoreItem {
  PK: string;
  SK: string;
  player: string;
  quizId: string;
  score: number;
}

export async function submitScore(
  userId: string,
  quizId: string,
  score: number
) {
  const user = await usersService.getUserById(userId);
  const quiz = await quizService.getQuizById(quizId);
  const maxScore = quiz.questions?.length || 0;

  if (score <= maxScore) {
    await database
      .put({
        TableName: process.env.TABLE_NAME as string,
        Item: {
          PK: `user#${userId}`,
          SK: `score#${nanoid()}`,
          quizId: `quiz#${quizId}`,
          player: user.username,
          score,
        },
      })
      .promise();
  } else {
    throw new ApiError(statusCodes.badRequest, {
      message: `Score can not exceed the maximum number of questions: '${maxScore}'`,
    });
  }
}

export async function getAllScores() {
  const { Items: scores } = await database
    .scan({
      TableName: process.env.TABLE_NAME as string,
      IndexName: process.env.QUIZ_INDEX as string,
      FilterExpression: 'begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'score#',
      },
    })
    .promise();

  return scores as ScoreItem[];
}

export async function createLeaderboardResponse(
  score: ScoreItem[],
  options = { topPlayersPerQuiz: 3 }
) {
  const leaderboard: {
    [id: string]: {
      id: string;
      name: string;
      score: { player: string; score: number }[];
    };
  } = {};

  for (const entry of score) {
    const quizId = entry.quizId.replace('quiz#', '');

    const playerEntry = {
      player: entry.player,
      score: entry.score,
    };

    if (!leaderboard[quizId]) {
      leaderboard[quizId] = {
        id: quizId,
        name: (await quizService.getQuizById(quizId)).name,
        score: [playerEntry],
      };
    } else {
      leaderboard[quizId].score.push(playerEntry);
    }
  }

  Object.keys(leaderboard).forEach((key) => {
    leaderboard[key].score.sort((a, b) => b.score - a.score);

    leaderboard[key].score = leaderboard[key].score.slice(
      0,
      options.topPlayersPerQuiz
    );
  });

  return Object.values(leaderboard);
}
