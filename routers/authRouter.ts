import { Request, Router, Status, z } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { error, ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { compare } from "../utils/hashing.ts";
import { createToken } from "../utils/jwt.ts";
import { AuthService } from "../services/authService.ts";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthRequest = z.infer<typeof AuthSchema>;
type AuthResponse = { token: string };

export const authRouter = (authService: AuthService) => {
  const login = async (
    request: Request,
  ): Promise<StandardResponse<AuthResponse>> => {
    const body = await request.body({ type: "json" }).value;
    const authRequest = AuthSchema.parse(body);
    try {
      const token = await authService.issueUserToken(authRequest);
      return { status: Status.OK, result: ok({ token }) };
    } catch (error) {
      return { status: Status.Unauthorized, result: error("Unauthorized") };
    }
  };

  const router = new Router();
  router.post("/login", generateRoute(login));
  return router;
};
