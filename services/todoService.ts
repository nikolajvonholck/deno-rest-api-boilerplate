import { Todo, TodoDTOCreate, TodoDTOUpdate } from "../models/Todo.ts";
import { TodoRepository } from "../repositories/todoRepository.ts";

import { UserInfo } from "../models/User.ts";

export interface TodoService {
  create: (
    userInfo: UserInfo,
    todoDtoCreate: TodoDTOCreate,
  ) => Promise<Todo>;
  readAll: (userInfo: UserInfo) => Promise<Todo[]>;
  readOne: (userInfo: UserInfo, id: string) => Promise<Todo | undefined>;
  update: (
    userInfo: UserInfo,
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ) => Promise<Todo | undefined>;
  delete: (userInfo: UserInfo, id: string) => Promise<Todo | undefined>;
}

export const makeTodoService = (todoRepo: TodoRepository): TodoService => {
  const create = async (
    userInfo: UserInfo,
    todoDtoCreate: TodoDTOCreate,
  ): Promise<Todo> => {
    const userId = userInfo.id as string;
    return await todoRepo.create({ ...todoDtoCreate, userId });
  };

  const readAll = async (userInfo: UserInfo): Promise<Todo[]> => {
    const userId = userInfo.id as string;
    return await todoRepo.readAll({ userId });
  };

  const readOne = async (
    userInfo: UserInfo,
    id: string,
  ): Promise<Todo | undefined> => {
    const userId = userInfo.id as string;
    return await todoRepo.readOne({ id, userId });
  };

  const update = async (
    userInfo: UserInfo,
    id: string,
    todoDtoUpdate: TodoDTOUpdate,
  ): Promise<Todo | undefined> => {
    const userId = userInfo.id as string;
    const todoBefore = await readOne(userInfo, id);
    if (!todoBefore || todoBefore.userId !== userId) {
      return;
    }
    await todoRepo.update(id, todoDtoUpdate);
    return await readOne(userInfo, id);
  };

  const _delete = async (
    userInfo: UserInfo,
    id: string,
  ): Promise<Todo | undefined> => {
    const userId = userInfo.id as string;
    const todoBefore = await readOne(userInfo, id);
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
