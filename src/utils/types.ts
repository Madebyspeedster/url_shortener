export interface LambdaEvent {
  routeKey: string;
  pathParameters?: {
    url: string;
  };
  body?: string;
}

export interface LambdaResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
}
