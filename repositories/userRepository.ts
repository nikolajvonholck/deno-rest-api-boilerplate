import { User, UserDTOCreate } from "../models/User.ts";

export interface UserRepository {
  create: (userDtoCreate: UserDTOCreate) => Promise<User>;
  findById: (id: string) => Promise<User | undefined>;
  findByEmail: (email: string) => Promise<User | undefined>;
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

export const userRepository: UserRepository = {
  create,
  findById,
  findByEmail,
};
