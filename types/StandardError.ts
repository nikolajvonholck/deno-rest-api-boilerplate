import { Status } from "../deps.ts";

export class StandardError extends Error {
  constructor(readonly status: Status, message: string) {
    super(message);
  }
}
