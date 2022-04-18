import { assertEquals } from "../dev_deps.ts";
import { Result, ResultError } from "../types/Result.ts";

export const databaseObjectToDTO = (object: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(object));

export const assertOk = <T>(result: Result<T>): T => {
  assertEquals(result.ok, true, "Result was unexpectedly not ok.");
  const { value } = result as unknown as { value: T };
  return value;
};

export const assertError = <T>(
  result: Result<T>,
): ResultError => {
  assertEquals(result.ok, false, "Result was unexpectedly ok.");
  const { error } = result as unknown as { error: ResultError };
  return error;
};
