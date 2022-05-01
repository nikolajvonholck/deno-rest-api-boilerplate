import { app } from "../app.ts";
import {
  afterEach,
  assertEquals,
  describe,
  it,
  superoak,
} from "../dev_deps.ts";
import { UserInfo } from "../models/User.ts";
import { userRepository } from "../repositories/userRepository.ts";
import { AuthResponse } from "../routers/authRouter.ts";
import { makeAuthService } from "../services/authService.ts";
import { database } from "../services/database.ts";
import { verifyToken } from "../utils/jwt.ts";
import { assertError, assertOk, databaseObjectToDTO } from "./utils.ts";

const path = "/auth";

const userCredentials = { email: "mail@example.com", password: "password" };
const authService = makeAuthService(userRepository);
const existingUser = await userRepository.findByEmail(userCredentials.email);
const user = existingUser ?? await authService.createUser(userCredentials);
const token = await authService.issueUserToken(userCredentials);
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

  describe("GET auth/me", () => {
    it("cannot get user info if unauthenticated", async () => {
      const request = await superoak(app);
      const response = await request
        .get(`${path}/me`)
        .expect(403);
      assertError(response.body);
    });

    it("cannot reach authenticated endpoint with invalid authorization header", async () => {
      const request = await superoak(app);
      const response = await request
        .get(`${path}/me`)
        .set("Authorization", "Invalid value")
        .expect(400);
      assertError(response.body);
    });

    it("cannot reach authenticated endpoint if user has been deleted", async () => {
      const tempUserCredentials = {
        email: "temp-user@example.com",
        password: "password",
      };
      const tempUser = await authService.createUser(tempUserCredentials);
      const tempUserToken = await authService.issueUserToken(
        tempUserCredentials,
      );

      const request1 = await superoak(app);
      const response1 = await request1
        .get(`${path}/me`)
        .set("Authorization", `Bearer ${tempUserToken}`)
        .expect(200);
      assertOk<UserInfo>(response1.body);

      await userRepository.delete(tempUser.id as string);

      const request2 = await superoak(app);
      const response2 = await request2
        .get(`${path}/me`)
        .set("Authorization", `Bearer ${tempUserToken}`)
        .expect(401);
      assertError(response2.body);
    });

    it(
      "can get user info if authenticated",
      async () => {
        const request = await superoak(app);
        const response = await request
          .get(`${path}/me`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200);
        const userInfo = assertOk<UserInfo>(response.body);

        const { passwordHash: _, ...userInfoDb } = databaseObjectToDTO(user);
        assertEquals(userInfo, userInfoDb);
      },
    );
  });
});
