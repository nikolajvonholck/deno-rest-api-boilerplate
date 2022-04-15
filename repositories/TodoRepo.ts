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

const create = async (todoDtoCreate: TodoDTOCreate): Promise<Todo> => {
  return await Todo.create(todoDtoCreate);
};

const findAll = async (): Promise<Todo[]> => {
  return await Todo.all();
};

const findById = async (id: string): Promise<Todo | undefined> => {
  return await Todo.find(id);
};

const update = async (
  id: string,
  todoDtoUpdate: TodoDTOUpdate,
): Promise<Todo | undefined> => {
  await Todo.where({ id }).update(todoDtoUpdate);
  return await findById(id);
};

const _delete = async (id: string): Promise<void> => {
  await Todo.deleteById(id);
};

export const TodoRepo: ITodoRepo = {
  create,
  findAll,
  findById,
  update,
  delete: _delete,
};
