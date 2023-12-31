import { nanoid } from 'nanoid';

import { database } from './database.service.ts';
import { ApiError } from '../errors/api.error.ts';

import { usersService } from './mod.ts';

import type { Question } from '../types/quiz.type.ts';

import { statusCodes } from '../types/statusCodes.type.ts';

interface QuizItem {
  SK: string;
  PK: string;
  quizId: string;
  name: string;
  author: string;
  questions?: Question[];
}

export async function getQuizById(quizId: string) {
  const { Items: quizes } = await database
    .query({
      TableName: process.env.TABLE_NAME as string,
      IndexName: process.env.QUIZ_INDEX as string,
      KeyConditionExpression: 'quizId = :quizId AND SK = :SK',
      ExpressionAttributeValues: {
        ':quizId': `quiz#${quizId}`,
        ':SK': `quiz#${quizId}`,
      },
      Limit: 1,
    })
    .promise();

  const { Items: questions } = await database
    .query({
      TableName: process.env.TABLE_NAME as string,
      IndexName: process.env.QUIZ_INDEX as string,
      KeyConditionExpression: 'quizId = :quizId AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':quizId': `quiz#${quizId}`,
        ':prefix': 'question#',
      },
    })
    .promise();

  const quiz = quizes?.at(0);

  if (quiz) {
    return {
      ...quiz,
      questions,
    } as QuizItem;
  } else {
    throw new ApiError(statusCodes.notFound, {
      message: `No quiz with the id: '${quizId}' was found`,
    });
  }
}

export async function createQuiz(userId: string, name: string) {
  const user = await usersService.getUserById(userId);
  const quizId = nanoid();

  await database
    .put({
      TableName: process.env.TABLE_NAME as string,
      Item: {
        PK: `user#${userId}`,
        SK: `quiz#${quizId}`,
        quizId: `quiz#${quizId}`,
        name,
        author: user.username,
      },
    })
    .promise();

  return quizId;
}

async function isQuizAuthor(userId: string, quizId: string) {
  const user = await usersService.getUserById(userId);
  const quiz = await getQuizById(quizId);
  const actualOwner = user.PK == quiz.PK;

  return actualOwner;
}

export async function addQuestionToQuiz(
  userId: string,
  quizId: string,
  question: Question
) {
  if (await isQuizAuthor(userId, quizId)) {
    await database
      .put({
        TableName: process.env.TABLE_NAME as string,
        Item: {
          PK: `user#${userId}`,
          SK: `question#${nanoid()}`,
          quizId: `quiz#${quizId}`,
          ...question,
        },
      })
      .promise();
  } else {
    throw new ApiError(statusCodes.forbidden, {
      message: `User with the id: '${userId}' don't have permission to add a question to quiz with the id: '${quizId}'`,
    });
  }
}

export async function getAllQuizes() {
  const { Items: quizes } = await database
    .scan({
      TableName: process.env.TABLE_NAME as string,
      IndexName: process.env.QUIZ_INDEX as string,
      FilterExpression: 'begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'quiz#',
      },
    })
    .promise();

  return quizes as QuizItem[];
}

export async function deleteQuizById(userId: string, quizId: string) {
  const quiz = await getQuizById(quizId);

  if (await isQuizAuthor(userId, quizId)) {
    const { Items: entries } = await database
      .scan({
        TableName: process.env.TABLE_NAME as string,
        IndexName: process.env.QUIZ_INDEX as string,
        FilterExpression: 'quizId = :quizId',
        ExpressionAttributeValues: {
          ':quizId': `quiz#${quizId}`,
        },
      })
      .promise();

    if (entries?.length) {
      const itemsToDelete = entries.map((entry) => ({
        Key: {
          PK: entry.PK,
          SK: entry.SK,
        },
      }));

      for (const item of itemsToDelete) {
        await database
          .delete({
            TableName: process.env.TABLE_NAME as string,
            ...item,
          })
          .promise();
      }
    }

    return quiz as QuizItem;
  } else {
    throw new ApiError(statusCodes.forbidden, {
      message: `User with the id: '${userId}' don't have permission to remove quiz with the id: '${quizId}'`,
    });
  }
}

export function createQuizResponse(quiz: QuizItem) {
  return {
    id: quiz.SK.replace('quiz#', ''),
    name: quiz.name,
    author: quiz.author,
    ...(quiz.questions?.length
      ? {
          questions: quiz.questions.map((question) => ({
            question: question.question,
            answer: question.answer,
            location: {
              longitude: question.location.longitude,
              latitude: question.location.latitude,
            },
          })),
        }
      : {}),
  };
}
