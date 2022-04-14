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
import { IController } from "../types/Controller.ts";
import { generateRoute } from "../utils/responses.ts";

export class TodoController implements IController {
  constructor(readonly todoRepo: ITodoRepo) {}

  getRouter(): Router {
    const router = new Router();
    router
      .post("/", generateRoute(this.create))
      .get("/", generateRoute(this.readAll))
      .get("/:id", generateRoute(this.read))
      .put("/:id", generateRoute(this.update))
      .delete("/:id", generateRoute(this.delete));
    return router;
  }

  async create(request: Request): Promise<StandardResponse<Todo>> {
    const body = request.body();
    console.info("body.value", body.value);
    const todoDtoCreate = TodoSchemaCreate.parse(body.value);
    console.info("todoDtoCreate", todoDtoCreate);

    const todo = await this.todoRepo.create(todoDtoCreate);
    console.info("todo", todo);

    return { status: Status.OK, result: ok(todo) };
  }

  async readAll(): Promise<StandardResponse<Todo[]>> {
    console.info("hej1", this.todoRepo);
    const todos = [] as Todo[]; // await this.todoRepo.findAll();
    console.info("hej2");
    return { status: Status.OK, result: ok(todos) };
  }

  async read(
    _request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<Todo>> {
    console.log("params", params);
    const { id } = IdSchema.parse(params);
    const todo = await this.todoRepo.findById(id);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  }

  async update(
    request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<Todo>> {
    console.log("params", params);
    const { id } = IdSchema.parse(params);
    const body = request.body();
    const todoDtoUpdate = TodoSchemaUpdate.parse(body.value);
    const todo = await this.todoRepo.update(id, todoDtoUpdate);
    if (todo) {
      return { status: Status.OK, result: ok(todo) };
    } else {
      return { status: Status.NotFound, result: error("Not Found") };
    }
  }

  async delete(
    _request: Request,
    params: RouteParams<"/:id">,
  ): Promise<StandardResponse<undefined>> {
    console.log("params", params);
    const { id } = IdSchema.parse(params);
    await this.todoRepo.delete(id);
    return { status: Status.OK, result: ok(undefined) };
  }
}
