import { Router } from "../deps.ts";

export interface IController {
  getRouter(): Router;
}
