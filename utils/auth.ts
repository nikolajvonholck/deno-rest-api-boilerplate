import { User } from "../models/User.ts";
import { StandardContext } from "../types/StandardRoute.ts";

export const guardAuthenticatedRoute = <R extends string>(
  ctx: StandardContext<R>,
): User => {
  const { user } = ctx.state;
  if (!user) {
    throw new Error("Unauthenticated");
  }
  return user;
};
