import {
  Response,
  RouteParams,
  RouterContext,
  RouterMiddleware,
} from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { StandardRoute, StandardState } from "../types/StandardRoute.ts";

export const generateRoute = <T, R extends string>(
  standardRoute: StandardRoute<T, R>,
): RouterMiddleware<R, RouteParams<R>, StandardState> => {
  return async (
    ctx: RouterContext<R, RouteParams<R>, StandardState>,
  ) => {
    const { response } = ctx;
    const standardResponse = await standardRoute(ctx);
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
