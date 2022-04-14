import {
  Response,
  RouteParams,
  RouterContext,
  RouterMiddleware,
} from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { StandardRoute } from "../types/StandardRoute.ts";

export const generateRoute = <T, R extends string, S>(
  standardRoute: StandardRoute<T, R>,
): RouterMiddleware<R, RouteParams<R>, S> => {
  return async (
    ctx: RouterContext<R, RouteParams<R>, S>,
  ) => {
    const { request, response, params } = ctx;
    const standardResponse = await standardRoute(request, params);
    sendStandardResponse(response, standardResponse);
  };
};

export function sendStandardResponse<T>(
  response: Response,
  standardResponse: StandardResponse<T>,
) {
  const { status, result } = standardResponse;
  response.status = status;
  response.body = result;
}
