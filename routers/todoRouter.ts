import {
  IdSchema,
  Todo,
  TodoSchemaCreate,
  TodoSchemaUpdate,
} from "../models/Todo.ts";
import { TodoRepository } from "../repositories/todoRepository.ts";
import { Router, Status } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { error, ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";
import { StandardContext } from "../types/StandardRoute.ts";
import { guardAuthenticatedRoute } from "../utils/auth.ts";
import { TodoService } from "../services/todoService.ts";

export const makeTodoRouter = (todoService: TodoService) => {
  const create = async (
    ctx: StandardContext<"/">,
  ): Promise<StandardResponse<Todo>> => {
    const { request } = ctx;
    const body = await request.body({ type: "json" }).value;
    const user = guardAuthenticatedRoute(ctx);
    const todoDtoCreate = TodoSchemaCreate.parse(body);
    const todo = await todoService.create(user, todoDtoCreate);
    return { status: Status.Created, result: ok(todo) };
  };

  const readAll = async (
    ctx: StandardContext<"/">,
  ): Promise<StandardResponse<Todo[]>> => {
    const user = guardAuthenticatedRoute(ctx);
    const todos = await todoService.readAll(user);
    return { status: Status.OK, result: ok(todos) };
  };

  const read = async (
    ctx: StandardContext<"/:id">,
  ): Promise<StandardResponse<Todo>> => {
    const { params } = ctx;
    const { id } = IdSchema.parse(params);
    const user = guardAuthenticatedRoute(ctx);
    const todo = await todoService.readOne(user, id);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  };

  const update = async (
    ctx: StandardContext<"/:id">,
  ): Promise<StandardResponse<Todo>> => {
    const { request, params } = ctx;
    const { id } = IdSchema.parse(params);
    const body = await request.body({ type: "json" }).value;
    const todoDtoUpdate = TodoSchemaUpdate.parse(body);
    const user = guardAuthenticatedRoute(ctx);
    const todo = await todoService.update(user, id, todoDtoUpdate);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  };

  const _delete = async (
    ctx: StandardContext<"/:id">,
  ): Promise<StandardResponse<Todo>> => {
    const { params } = ctx;
    const { id } = IdSchema.parse(params);
    const user = guardAuthenticatedRoute(ctx);
    const todo = await todoService.delete(user, id);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
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
