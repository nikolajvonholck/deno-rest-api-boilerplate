import { Middleware, Status, z } from "../deps.ts";
import { Result } from "../types/Result.ts";
import { sendStandardResponse } from "../utils/responses.ts";

export const uncaughtExceptionHandler: Middleware = async (
  { response },
  next,
) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const result: Result<unknown> = {
        ok: false,
        error: error.issues,
      };
      const standardResponse = { status: Status.BadRequest, result };
      sendStandardResponse(response, standardResponse);
    } else {
      // In case of an uncaught exception, we return a well-formed response.
      const result: Result<unknown> = { ok: false, error: error.message };
      const standardResponse = { status: Status.InternalServerError, result };
      sendStandardResponse(response, standardResponse);
    }
  }
};

export const routeNotFoundHandler: Middleware = async ({ response }, next) => {
  await next();
  // Always returns not found.
  const result: Result<unknown> = { ok: false, error: "Route not found." };
  const standardResponse = { status: Status.NotFound, result };
  sendStandardResponse(response, standardResponse);
};
