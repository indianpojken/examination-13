import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

import { database } from './database.service.ts';
import { ApiError } from '../errors/api.error.ts';

export async function getUserById(id: string) {
  const { Item: user } = await database
    .get({
      TableName: process.env.TABLE_NAME as string,
      Key: {
        PK: `user#${id}`,
        SK: 'registration',
      },
    })
    .promise();

  if (user) {
    return user;
  } else {
    throw new ApiError(404, {
      message: `No user with the id: '${id}' was found`,
    });
  }
}

export async function getUserByUsername(username: string) {
  const { Items: users } = await database
    .query({
      TableName: process.env.TABLE_NAME as string,
      IndexName: process.env.USERNAME_INDEX as string,
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username },
      Limit: 1,
    })
    .promise();

  const user = users?.at(0);

  return user;
}

export async function registerUser(username: string, password: string) {
  const user = await getUserByUsername(username);

  if (!user) {
    await database
      .put({
        TableName: process.env.TABLE_NAME as string,
        Item: {
          PK: `user#${nanoid()}`,
          SK: 'registration',
          username: username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        },
      })
      .promise();
  } else {
    throw new ApiError(409, {
      message: `Username: '${username}' is already in use`,
    });
  }
}

export async function loginUser(username: string, password: string) {
  const user = await getUserByUsername(username);

  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { userId: user.PK.replace('user#', '') },
        process.env.JWT_SECRET as string,
        { expiresIn: '30m' }
      );

      return token;
    } else {
      throw new ApiError(401, { message: 'Incorrect password' });
    }
  } else {
    throw new ApiError(404, {
      message: `No user with the username: '${username}' was found`,
    });
  }
}
