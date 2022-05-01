import { Values } from "../deps.ts";
import { Todo, TodoDTOCreate, TodoDTOUpdate } from "../models/Todo.ts";

export interface TodoRepository {
  create: (todoDtoCreate: TodoDTOCreate) => Promise<Todo>;
  readAll: (where?: Values) => Promise<Todo[]>;
  readOne: (where: Values) => Promise<Todo | undefined>;
  update: (id: string, todoDtoUpdate: TodoDTOUpdate) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

const create = async (todoDtoCreate: TodoDTOCreate): Promise<Todo> => {
  const defaultValues = {
    isCompleted: false,
  };
  const id = crypto.randomUUID();
  const todo = {
    ...defaultValues,
    ...todoDtoCreate,
    id,
  };
  return await Todo.create(todo);
};

const readAll = async (where?: Values): Promise<Todo[]> => {
  const query = where ? Todo.where(where) : Todo;
  return await query.all();
};

const readOne = async (where: Values): Promise<Todo | undefined> => {
  return await Todo.where(where).first();
};

const update = async (
  id: string,
  todoDtoUpdate: TodoDTOUpdate,
): Promise<void> => {
  await Todo.where({ id }).update(todoDtoUpdate);
};

const _delete = async (id: string): Promise<void> => {
  await Todo.deleteById(id);
};

export const todoRepository: TodoRepository = {
  create,
  readAll,
  readOne,
  update,
  delete: _delete,
};
