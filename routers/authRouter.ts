import { Router, RouterContext, Status, z } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";
import { AuthService } from "../services/authService.ts";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthResponse = { token: string };

export const authRouter = (authService: AuthService) => {
  const login = async (
    ctx: RouterContext<"/login">,
  ): Promise<StandardResponse<AuthResponse>> => {
    const { request } = ctx;
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
