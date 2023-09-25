import 'aws-lambda';

declare module 'aws-lambda' {
  export interface APIGatewayProxyEventBase<TAuthorizerContext> {
    auth?: any;
  }
}
