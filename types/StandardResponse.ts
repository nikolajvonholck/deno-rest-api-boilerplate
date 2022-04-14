import { Status } from "../deps.ts";
import { Result } from "./Result.ts";

export type StandardResponse<T> = { status: Status; result: Result<T> };
