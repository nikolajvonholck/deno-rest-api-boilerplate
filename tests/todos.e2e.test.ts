import { app } from "../app.ts";
import { assertEquals, superoak } from "../dev_deps.ts";
import { TodoDTO } from "../models/Todo.ts";
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

const path = "/todos";
const todoDtoCreate = { title: "Title" };
const todoDtoCreateMalformed = { title: 42 };
const todoDtoUpdate = { title: "New title", isCompleted: true };
const todoDtoUpdateMalformed = { isCompleted: 42 };

Deno.test("todo router", async (t) => {
  await t.step(
    "returns error if attempting to create todo with malformed input",
    async () => {
      const request = await superoak(app);
      const response = await request
        .post(path)
        .send(todoDtoCreateMalformed)
        .expect(500);
      assertError(response.body);
      await database.close();
    },
  );

  await t.step("can create todo with well-formed input", async () => {
    const request = await superoak(app);
    const response = await request
      .post(path)
      .send(todoDtoCreate)
      .expect(201);
    const todo = assertOk(response.body as Result<TodoDTO>);
    assertEquals(todo.title, todoDtoCreate.title);
    assertEquals(todo.isCompleted, false);

    // Verify that object has been saved in database.
    const todoFromDatabase = await todoRepository.findById(todo.id);
    assertEquals(databaseObjectToDTO(todoFromDatabase), todo);

    await database.close();
  });

  await t.step("cannot read todo if it does not exist", async () => {
    const uuid = globalThis.crypto.randomUUID();

    const request = await superoak(app);
    const response = await request
      .get(`${path}/${uuid}`)
      .expect(404);
    assertError(response.body);

    await database.close();
  });

  await t.step("can read todo if it exists", async () => {
    const todoFromDatabase = await todoRepository.create(todoDtoCreate);

    const request = await superoak(app);
    const response = await request
      .get(`${path}/${todoFromDatabase.id}`)
      .expect(200);
    const todo = assertOk(response.body as Result<TodoDTO>);

    // Verify that object has been read from database.
    assertEquals(todo, databaseObjectToDTO(todoFromDatabase));

    await database.close();
  });
});
