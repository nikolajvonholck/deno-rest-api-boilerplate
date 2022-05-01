import { User, UserDTOCreate } from "../models/User.ts";

export interface UserRepository {
  create: (userDtoCreate: UserDTOCreate) => Promise<User>;
  findById: (id: string) => Promise<User | undefined>;
  findByEmail: (email: string) => Promise<User | undefined>;
  delete: (id: string) => Promise<void>;
}

const create = async (userDtoCreate: UserDTOCreate): Promise<User> => {
  const id = crypto.randomUUID();
  const userCreate = {
    ...userDtoCreate,
    id,
  };
  return await User.create(userCreate);
};

const findById = async (id: string): Promise<User | undefined> => {
  return await User.find(id);
};

const findByEmail = async (email: string): Promise<User | undefined> => {
  return await User.where({ email }).first();
};

const _delete = async (id: string): Promise<void> => {
  await User.deleteById(id);
};

export const userRepository: UserRepository = {
  create,
  findById,
  findByEmail,
  delete: _delete,
};
