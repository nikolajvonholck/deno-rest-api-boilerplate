import { Router, RouterContext, Status, z } from "../deps.ts";
import { StandardResponse } from "../types/StandardResponse.ts";
import { ok } from "../types/Result.ts";
import { generateRoute } from "../utils/responses.ts";
import { AuthService } from "../services/authService.ts";
import { guardAuthenticatedRoute } from "../utils/auth.ts";
import { UserInfo } from "../models/User.ts";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthResponse = { token: string };

export const authRouter = (authService: AuthService) => {
  const login = async (
    ctx: RouterContext<"/login">,
  ): Promise<StandardResponse<AuthResponse>> => {
    const { request } = ctx;
    const body = await request.body({ type: "json" }).value;
    const authRequest = AuthSchema.parse(body);
    const token = await authService.issueUserToken(authRequest);
    return { status: Status.OK, result: ok({ token }) };
  };

  // deno-lint-ignore require-await
  const me = async (
    ctx: RouterContext<"/me">,
  ): Promise<StandardResponse<UserInfo>> => {
    const user = guardAuthenticatedRoute(ctx);
    return { status: Status.OK, result: ok(user) };
  };

  const router = new Router();
  router
    .post("/login", generateRoute(login))
    .get("/me", generateRoute(me));

  return router;
};
