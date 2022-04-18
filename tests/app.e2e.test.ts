import { app } from "../app.ts";
import { superoak } from "../dev_deps.ts";
import { database } from "../services/database.ts";
import { assertError } from "./utils.ts";

Deno.test("app", async (t) => {
  await t.step("returns not found if route is not found", async () => {
    const request = await superoak(app);
    const response = await request
      .get("/not-found")
      .expect(404);
    assertError(response.body);
    await database.close();
  });
});
