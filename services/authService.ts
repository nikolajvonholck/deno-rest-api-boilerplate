import { Status } from "../deps.ts";
import { User, UserInfo } from "../models/User.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { StandardError } from "../types/StandardError.ts";
import { compare, hash } from "../utils/hashing.ts";
import { createToken, Token, verifyToken } from "../utils/jwt.ts";

export type UserCredentials = {
  email: string;
  password: string;
};

export interface AuthService {
  issueUserToken: (userCredentials: UserCredentials) => Promise<Token>;
  verifyUserToken: (token: Token) => Promise<UserInfo>;
  createUser: (userCredentials: UserCredentials) => Promise<User>;
}

export const makeAuthService = (userRepo: UserRepository): AuthService => {
  const issueUserToken = async (
    userCredential: UserCredentials,
  ): Promise<Token> => {
    const { email, password } = userCredential;
    const user = await userRepo.findByEmail(email);
    if (user) {
      const passwordHash = user.passwordHash as string;
      const isPasswordValid = await compare(password, passwordHash);
      if (isPasswordValid) {
        const payload = { sub: user.id as string };
        return await createToken(payload);
      }
    }
    throw new StandardError(Status.Unauthorized, "Unauthorized");
  };

  const verifyUserToken = async (
    token: Token,
  ): Promise<UserInfo> => {
    const payload = await verifyToken(token);
    const { sub: id } = payload;
    const user = await userRepo.findById(id);
    if (!user) {
      throw new StandardError(Status.Unauthorized, "Unauthorized");
    }
    const { passwordHash: _, ...userWithoutPasswordHash } = user;
    return userWithoutPasswordHash;
  };

  const createUser = async (
    userCredentials: UserCredentials,
  ): Promise<User> => {
    const { password, ...userInfo } = userCredentials;
    const passwordHash = await hash(password);
    const userCreate = {
      ...userInfo,
      passwordHash,
    };
    return await userRepo.create(userCreate);
  };

  return {
    issueUserToken,
    verifyUserToken,
    createUser,
  };
};
