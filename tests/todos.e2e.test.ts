import { app } from "../app.ts";
import { assertEquals, superoak } from "../dev_deps.ts";
import { Todo, TodoDTO } from "../models/Todo.ts";
import { todoRepository } from "../repositories/todoRepository.ts";
import { database } from "../services/database.ts";
import { Result, ResultError } from "../types/Result.ts";

const databaseObjectToDTO = (object: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(object));

const assertOk = <T>(result: Result<T>): T => {
  assertEquals(result.ok, true, "Result was unexpectedly not ok.");
  if (result.ok) {
    return result.value;
  }
  throw new Error("Impossible");
};

const assertError = <T>(
  result: Result<T>,
): ResultError => {
  assertEquals(result.ok, false, "Result was unexpectedly ok.");
  if (!result.ok) {
    return result.error;
  }
  throw new Error("Impossible");
};

Deno.test("todo router", async (t) => {
  await t.step(
    "returns error if attempting to create todo with malformed input",
    async () => {
      const request = await superoak(app);
      const response = await request
        .post("/todos")
        .send({ title: 42 })
        .expect(500);
      assertError(response.body);
      await database.close();
    },
  );

  await t.step("can create todo with well-formed input", async () => {
    const request = await superoak(app);
    const response = await request
      .post("/todos")
      .send({ title: "Test" })
      .expect(201);
    const todo = assertOk(response.body as Result<TodoDTO>);
    assertEquals(todo.title, "Test");

    // Verify that object has been saved in database.
    const todoFromDatabase = await todoRepository.findById(todo.id);
    assertEquals(databaseObjectToDTO(todoFromDatabase), todo);

    await database.close();
  });

  await t.step("cannot read todo if it does not exist", async () => {
    const uuid = globalThis.crypto.randomUUID();

    const request = await superoak(app);
    const response = await request
      .get(`/todos/${uuid}`)
      .expect(404);
    assertError(response.body);

    await database.close();
  });

  await t.step("can read todo if it exists", async () => {
    const todoFromDatabase = await todoRepository.create({ title: "Test" });

    const request = await superoak(app);
    const response = await request
      .get(`/todos/${todoFromDatabase.id}`)
      .expect(200);
    const todo = assertOk(response.body as Result<TodoDTO>);

    // Verify that object has been read from database.
    assertEquals(todo, databaseObjectToDTO(todoFromDatabase));

    await database.close();
  });
});
