import {
  IdSchema,
  Todo,
  TodoSchemaCreate,
  TodoSchemaUpdate,
} from "../models/Todo.ts";
import { ITodoRepo } from "../repositories/TodoRepo.ts";
import { Request, RouteParams, Router, Status } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { error, ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";

export const TodoRouter = (todoRepo: ITodoRepo) => {
  const create = async (request: Request): Promise<StandardResponse<Todo>> => {
    const body = await request.body({ type: "json" }).value;
    const todoDtoCreate = TodoSchemaCreate.parse(body);
    const todo = await todoRepo.create(todoDtoCreate);
    return { status: Status.OK, result: ok(todo) };
  };

  const readAll = async (): Promise<StandardResponse<Todo[]>> => {
    const todos = await todoRepo.findAll();
    return { status: Status.OK, result: ok(todos) };
  };

  const read = async (
    _request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<Todo>> => {
    const { id } = IdSchema.parse(params);
    const todo = await todoRepo.findById(id);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  };

  const update = async (
    request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<Todo>> => {
    const { id } = IdSchema.parse(params);
    const body = await request.body({ type: "json" }).value;
    const todoDtoUpdate = TodoSchemaUpdate.parse(body);
    const todo = await todoRepo.update(id, todoDtoUpdate);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  };

  const _delete = async (
    _request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<undefined>> => {
    const { id } = IdSchema.parse(params);
    await todoRepo.delete(id);
    return { status: Status.OK, result: ok(undefined) };
  };

  const router = new Router();
  router
    .post("/", generateRoute(create))
    .get("/", generateRoute(readAll))
    .get("/:id", generateRoute(read))
    .put("/:id", generateRoute(update))
    .delete("/:id", generateRoute(_delete));
  return router;
};
