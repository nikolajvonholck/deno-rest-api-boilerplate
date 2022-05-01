import { Middleware, Status, z } from "../deps.ts";
import { error } from "../types/Result.ts";
import { StandardError } from "../types/StandardError.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { sendStandardResponse } from "../utils/responses.ts";

export const uncaughtExceptionHandler: Middleware = async (
  { response },
  next,
) => {
  try {
    await next();
  } catch (err) {
    let standardResponse: StandardResponse<void>;
    if (err instanceof z.ZodError) {
      standardResponse = {
        status: Status.BadRequest,
        result: error(err.issues),
      };
    } else if (err instanceof StandardError) {
      standardResponse = {
        status: err.status,
        result: error(err.message),
      };
    } else {
      // In case of an uncaught exception, we return a well-formed response.
      standardResponse = {
        status: Status.InternalServerError,
        result: error(err.message),
      };
    }
    sendStandardResponse(response, standardResponse);
  }
};

export const routeNotFoundHandler: Middleware = async (_, next) => {
  await next();
  // Always returns not found.
  throw new StandardError(Status.NotFound, "Not Found");
};
