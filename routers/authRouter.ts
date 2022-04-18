import { Request, Router, Status, z } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { error, ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { compare } from "../utils/hashing.ts";
import { createToken } from "../utils/jwt.ts";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthRequest = z.infer<typeof AuthSchema>;
type AuthResponse = { token: string };

export const authRouter = (userRepo: UserRepository) => {
  const login = async (
    request: Request,
  ): Promise<StandardResponse<AuthResponse>> => {
    const body = await request.body({ type: "json" }).value;
    const authRequest = AuthSchema.parse(body);
    const { email, password } = authRequest;
    const user = await userRepo.findByEmail(email);

    if (user) {
      const isPasswordValid = await compare(
        password,
        user.passwordHash as string,
      );
      if (isPasswordValid) {
        const payload = { sub: user.id as string };
        const token = await createToken(payload);
        return { status: Status.OK, result: ok({ token }) };
      }
    }
    return { status: Status.Unauthorized, result: error("Unauthorized") };
  };

  const router = new Router();
  router.post("/login", generateRoute(login));
  return router;
};
