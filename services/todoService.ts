import { Todo, TodoDTOCreate, TodoDTOUpdate } from "../models/Todo.ts";
import { TodoRepository } from "../repositories/todoRepository.ts";

import { User } from "../models/User.ts";

export interface TodoService {
  create: (
    user: User,
    todoDtoCreate: TodoDTOCreate,
  ) => Promise<Todo>;
  readAll: (user: User) => Promise<Todo[]>;
  readOne: (user: User, id: string) => Promise<Todo | undefined>;
  update: (
    user: User,
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ) => Promise<Todo | undefined>;
  delete: (user: User, id: string) => Promise<Todo | undefined>;
}

export const makeTodoService = (todoRepo: TodoRepository): TodoService => {
  const create = async (
    user: User,
    todoDtoCreate: TodoDTOCreate,
  ): Promise<Todo> => {
    const userId = user.id as string;
    return await todoRepo.create({ ...todoDtoCreate, userId });
  };

  const readAll = async (user: User): Promise<Todo[]> => {
    const userId = user.id as string;
    return await todoRepo.readAll({ userId });
  };

  const readOne = async (user: User, id: string): Promise<Todo | undefined> => {
    const userId = user.id as string;
    return await todoRepo.readOne({ id, userId });
  };

  const update = async (
    user: User,
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ): Promise<Todo | undefined> => {
    const userId = user.id as string;
    const todoBefore = await readOne(user, id);
    if (!todoBefore || todoBefore.userId !== userId) {
      return;
    }
    await todoRepo.update(id, todoDtoUpdate);
    return await readOne(user, id);
  };

  const _delete = async (user: User, id: string): Promise<Todo | undefined> => {
    const userId = user.id as string;
    const todoBefore = await readOne(user, id);
    if (!todoBefore || todoBefore.userId !== userId) {
      return;
    }
    await todoRepo.delete(id);
    return todoBefore;
  };

  return {
    create,
    readAll,
    readOne,
    update,
    delete: _delete,
  };
};
