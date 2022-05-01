import { app } from "../app.ts";
import {
  afterEach,
  assertEquals,
  describe,
  it,
  superoak,
} from "../dev_deps.ts";
import { userRepository } from "../repositories/userRepository.ts";
import { AuthResponse } from "../routers/authRouter.ts";
import { makeAuthService } from "../services/authService.ts";
import { database } from "../services/database.ts";
import { verifyToken } from "../utils/jwt.ts";
import { assertError, assertOk } from "./utils.ts";

const path = "/auth";

const userCredentials = { email: "mail@example.com", password: "password" };
const authService = makeAuthService(userRepository);
const existingUser = await userRepository.findByEmail(userCredentials.email);
const user = existingUser ?? await authService.createUser(userCredentials);
await database.close();

describe("auth router", () => {
  afterEach(async () => {
    await database.close();
  });

  describe("POST auth/login", () => {
    it("cannot login if user does not exist", async () => {
      const userCredentials = {
        email: "non-existing-user@example.com",
        password: "password",
      };

      const request = await superoak(app);
      const response = await request
        .post(`${path}/login`)
        .send(userCredentials)
        .expect(401);
      assertError(response.body);
    });

    it(
      "returns error if attempting to login with malformed input",
      async () => {
        const malformedUserCredentials = {
          email: "malformedemail",
          password: "password",
        };

        const request = await superoak(app);
        const response = await request
          .post(`${path}/login`)
          .send(malformedUserCredentials)
          .expect(400);
        assertError(response.body);
      },
    );

    it(
      "can login with valid user credentials",
      async () => {
        const request = await superoak(app);
        const response = await request
          .post(`${path}/login`)
          .send(userCredentials)
          .expect(200);
        const { token } = assertOk<AuthResponse>(response.body);

        // Verify token.
        const { sub } = await verifyToken(token);
        assertEquals(sub, user.id);
      },
    );

    it(
      "cannot login with invalid password",
      async () => {
        const request = await superoak(app);
        const response = await request
          .post(`${path}/login`)
          .send({ email: userCredentials.email, password: "wrong-password" })
          .expect(401);
        assertError(response.body);
      },
    );
  });
});
