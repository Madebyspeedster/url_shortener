import { handleMinify, handleRedirect } from "./service/urlManger";
import { handleDemoPage } from "./utils/html";
import { LambdaEvent, LambdaResponse } from "./utils/types";

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  const routes: Record<string, () => Promise<LambdaResponse> | LambdaResponse> =
    {
      "GET /at/{url}": async () => {
        if (event.pathParameters?.url) {
          return await handleRedirect(event.pathParameters.url);
        }
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "URL parameter is missing",
          }),
        };
      },
      "GET /demo": () => handleDemoPage(),
      "POST /minify": async () => await handleMinify(event.body),
    };
  const routeHandler = routes[event.routeKey];
  if (routeHandler) {
    return await routeHandler();
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "Route not found",
      route: event.routeKey,
    }),
  };
};
