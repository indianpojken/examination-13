import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const database = new DocumentClient({
  region: process.env.AWS_REGION,
});
