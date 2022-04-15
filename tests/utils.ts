import { assertEquals } from "../dev_deps.ts";
import { Result, ResultError } from "../types/Result.ts";

export const databaseObjectToDTO = (object: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(object));

export const assertOk = <T>(result: Result<T>): T => {
  assertEquals(result.ok, true, "Result was unexpectedly not ok.");
  if (result.ok) {
    return result.value;
  }
  throw new Error("Impossible");
};

export const assertError = <T>(
  result: Result<T>,
): ResultError => {
  assertEquals(result.ok, false, "Result was unexpectedly ok.");
  if (!result.ok) {
    return result.error;
  }
  throw new Error("Impossible");
};
