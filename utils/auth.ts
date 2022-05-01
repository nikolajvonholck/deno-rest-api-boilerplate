import { Status } from "../deps.ts";
import { User } from "../models/User.ts";
import { StandardError } from "../types/StandardError.ts";
import { StandardContext } from "../types/StandardRoute.ts";

export const guardAuthenticatedRoute = <R extends string>(
  ctx: StandardContext<R>,
): User => {
  const { user } = ctx.state;
  if (!user) {
    throw new StandardError(Status.Forbidden, "Unauthenticated");
  }
  return user;
};
