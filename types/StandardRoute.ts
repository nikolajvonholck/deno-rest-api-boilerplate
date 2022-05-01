import { RouteParams, RouterContext } from "../deps.ts";
import { User } from "../models/User.ts";
import { StandardResponse } from "./StandardResponse.ts";

export type StandardState = { user?: User };
export type StandardContext<R extends string> = RouterContext<
  R,
  RouteParams<R>,
  StandardState
>;

export type StandardRoute<T, R extends string> = (
  ctx: StandardContext<R>,
) => Promise<StandardResponse<T>>;
