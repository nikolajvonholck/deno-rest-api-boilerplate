import { app } from "../app.ts";
import { assertEquals, superoak } from "../dev_deps.ts";
import { database } from "../services/database.ts";
import { assertError } from "./utils.ts";

Deno.test("app", async (t) => {
  const uuid = globalThis.crypto.randomUUID();

  await t.step("returns not found if route is not found", async () => {
    const request = await superoak(app);
    const response = await request
      .get(`/${uuid}`)
      .expect(404);
    assertError(response.body);
    await database.close();
  });

  // We now alter the app instance so that it always throws an exception.
  const errorMessage = "Uncaught exception.";
  app.use(() => {
    throw new Error(errorMessage);
  });

  await t.step(
    "returns internal server error upon uncaught exception",
    async () => {
      const request = await superoak(app);
      const response = await request
        .get(`/${uuid}`)
        .expect(500);
      const error = assertError(response.body);
      assertEquals(error, errorMessage);

      await database.close();
    },
  );
  // Note: This above test should be the last test to run in this file
  // because the app instance is essentially ruined at this point of execution.
});
