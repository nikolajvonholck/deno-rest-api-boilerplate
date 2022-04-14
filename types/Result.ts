export type ResultError = string;

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: ResultError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const error = <T>(error: ResultError): Result<T> => ({
  ok: false,
  error,
});
