import { Middleware, Status } from "../deps.ts";
import { AuthService } from "../services/authService.ts";
import { StandardError } from "../types/StandardError.ts";
import { StandardState } from "../types/StandardRoute.ts";

export const makeAuthMiddleware = (
  authSerive: AuthService,
): Middleware<StandardState> => {
  const authorizationHeaderRegEx = /^Bearer (.*)$/;

  return async (ctx, next) => {
    const { request, state } = ctx;
    const authorizationHeader = request.headers.get("Authorization");
    if (authorizationHeader) {
      const matches = authorizationHeaderRegEx.exec(authorizationHeader);
      if (!matches) {
        throw new StandardError(
          Status.BadRequest,
          "Malformed authorization header.",
        );
      }
      const token = matches[1];
      const user = await authSerive.verifyUserToken(token);
      state.user = user;
    }
    await next();
  };
};
