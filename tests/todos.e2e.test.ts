import { app } from "../app.ts";
import { assertEquals, superoak } from "../dev_deps.ts";
import { TodoDTO } from "../models/Todo.ts";
import { todoRepository } from "../repositories/todoRepository.ts";
import { database } from "../services/database.ts";
import { Result } from "../types/Result.ts";
import { assertError, assertOk, databaseObjectToDTO } from "./utils.ts";

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
    const { id, title, isCompleted } = todo;
    assertEquals(title, todoDtoCreate.title);
    assertEquals(isCompleted, false);

    // Verify that object has been saved in database.
    const todoFromDatabase = await todoRepository.findById(id);
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

  await t.step("can read todo", async () => {
    const todoFromDatabase = await todoRepository.create(todoDtoCreate);
    const id = todoFromDatabase.id as string;

    const request = await superoak(app);
    const response = await request
      .get(`${path}/${id}`)
      .expect(200);
    const todo = assertOk(response.body as Result<TodoDTO>);

    // Verify that object has been read from database.
    assertEquals(todo, databaseObjectToDTO(todoFromDatabase));

    await database.close();
  });

  await t.step("cannot update todo if it does not exist", async () => {
    const uuid = globalThis.crypto.randomUUID();

    const request = await superoak(app);
    const response = await request
      .put(`${path}/${uuid}`)
      .send(todoDtoUpdate)
      .expect(404);
    assertError(response.body);

    await database.close();
  });

  await t.step(
    "returns error if attempting to update todo with malformed input",
    async () => {
      const todoFromDatabaseBefore = await todoRepository.create(
        todoDtoCreate,
      );
      const id = todoFromDatabaseBefore.id as string;

      const request = await superoak(app);
      const response = await request
        .put(`${path}/${id}`)
        .send(todoDtoUpdateMalformed)
        .expect(500);
      assertError(response.body);

      // Verify that object is unaffected in database.
      const todoFromDatabaseAfter = await todoRepository.findById(id);
      assertEquals(
        databaseObjectToDTO(todoFromDatabaseAfter),
        databaseObjectToDTO(todoFromDatabaseBefore),
      );

      await database.close();
    },
  );

  await t.step("can update todo with well-formed input", async () => {
    const todoFromDatabaseBefore = await todoRepository.create(
      todoDtoCreate,
    );
    const id = todoFromDatabaseBefore.id as string;

    const request = await superoak(app);
    const response = await request
      .put(`${path}/${id}`)
      .send(todoDtoUpdate)
      .expect(200);
    const todo = assertOk(response.body as Result<TodoDTO>);
    assertEquals(todo.title, todoDtoUpdate.title);
    assertEquals(todo.isCompleted, todoDtoUpdate.isCompleted);

    // Verify that object has been saved in database.
    const todoFromDatabaseAfter = await todoRepository.findById(id);
    // Ignore property 'updatedAt'.
    const { updatedAt: _, ...before } = databaseObjectToDTO(
      todoFromDatabaseBefore,
    );
    const { updatedAt: __, ...after } = databaseObjectToDTO(
      todoFromDatabaseAfter,
    );
    assertEquals({ ...before, ...todoDtoUpdate }, after);

    await database.close();
  });

  await t.step("cannot delete todo if it does not exist", async () => {
    const uuid = globalThis.crypto.randomUUID();

    const request = await superoak(app);
    const response = await request
      .delete(`${path}/${uuid}`)
      .expect(404);
    assertError(response.body);

    await database.close();
  });

  await t.step("can delete todo", async () => {
    const todoFromDatabase = await todoRepository.create(todoDtoCreate);
    const id = todoFromDatabase.id as string;

    const request = await superoak(app);
    const response = await request
      .delete(`${path}/${id}`)
      .expect(200);
    const v = assertOk(response.body as Result<undefined>);
    assertEquals(v, undefined);

    // Verify that object has been delete from database.
    const todoFromDatabaseAfter = await todoRepository.findById(id);
    assertEquals(todoFromDatabaseAfter, undefined);

    await database.close();
  });
});
