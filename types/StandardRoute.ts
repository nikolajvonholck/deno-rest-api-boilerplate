import { Request, RouteParams } from "../deps.ts";
import { StandardResponse } from "./StandardResponse.ts";

export type StandardRoute<T, R extends string> = (
  request: Request,
  params: RouteParams<R>,
) => Promise<StandardResponse<T>>;
