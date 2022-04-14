import { IDatabaseService } from "../services/DatabaseService.ts";
import { Todo, TodoDTOCreate, TodoDTOUpdate } from "../models/Todo.ts";

export interface ITodoRepo {
  create: (todoDtoCreate: TodoDTOCreate) => Promise<Todo>;
  findAll: () => Promise<Todo[]>;
  findById: (id: string) => Promise<Todo | undefined>;
  update: (
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ) => Promise<Todo | undefined>;
  delete: (id: string) => Promise<void>;
}

export class TodoRepo implements ITodoRepo {
  constructor(readonly databaseService: IDatabaseService) {
    databaseService.database.link([Todo]);
  }

  async create(todoDtoCreate: TodoDTOCreate): Promise<Todo> {
    return await Todo.create(todoDtoCreate);
  }

  async findAll(): Promise<Todo[]> {
    return await Todo.all();
  }

  async findById(id: string): Promise<Todo | undefined> {
    return await Todo.find(id);
  }

  async update(
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ): Promise<Todo | undefined> {
    return await Todo.where({ id }).update(todoDtoUpdate) as
      | Todo
      | undefined;
  }

  async delete(id: string): Promise<void> {
    await Todo.deleteById(id);
  }
}
