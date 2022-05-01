import { app } from "../app.ts";
import {
  afterEach,
  assertEquals,
  describe,
  it,
  superoak,
} from "../dev_deps.ts";
import { Todo, TodoDTO } from "../models/Todo.ts";
import { todoRepository } from "../repositories/todoRepository.ts";
import { userRepository } from "../repositories/userRepository.ts";
import { makeAuthService } from "../services/authService.ts";
import { database } from "../services/database.ts";
import { makeTodoService } from "../services/todoService.ts";
import { Result } from "../types/Result.ts";
import { assertError, assertOk, databaseObjectToDTO } from "./utils.ts";

const path = "/todos";
const todoDtoCreate = { title: "Title" };
const todoDtoCreateMalformed = { title: 42 };
const todoDtoUpdate = { title: "New title", isCompleted: true };
const todoDtoUpdateMalformed = { isCompleted: 42 };

const todoService = makeTodoService(todoRepository);
const userCredentials = { email: "mail@example.com", password: "password" };
const authService = makeAuthService(userRepository);
const existingUser = await userRepository.findByEmail(userCredentials.email);
const user = existingUser ?? await authService.createUser(userCredentials);
const token = await authService.issueUserToken(userCredentials);
await database.close();

describe("todo router", () => {
  afterEach(async () => {
    await Todo.delete();
    await database.close();
  });

  describe("POST todos/", () => {
    it(
      "returns error if attempting to create todo with malformed input",
      async () => {
        const request = await superoak(app);
        const response = await request
          .post(path)
          .set("Authorization", `Bearer ${token}`)
          .send(todoDtoCreateMalformed)
          .expect(400);
        assertError(response.body);
      },
    );

    it("cannot create todo if unauthenticated", async () => {
      const request = await superoak(app);
      const response = await request
        .post(path)
        .send(todoDtoCreate)
        .expect(403);
      assertError(response.body);
    });

    it("can create todo with well-formed input", async () => {
      const request = await superoak(app);
      const response = await request
        .post(path)
        .set("Authorization", `Bearer ${token}`)
        .send(todoDtoCreate)
        .expect(201);
      const todo = assertOk(response.body as Result<TodoDTO>);
      const { id, title, isCompleted, userId } = todo;
      assertEquals(title, todoDtoCreate.title);
      assertEquals(isCompleted, false);
      assertEquals(userId, user.id);

      // Verify that object has been saved in database.
      const todoFromDatabase = await todoRepository.readOne({ id });
      assertEquals(databaseObjectToDTO(todoFromDatabase), todo);
    });
  });

  describe("GET todos/:id", () => {
    it("cannot read todo if it does not exist", async () => {
      const uuid = crypto.randomUUID();

      const request = await superoak(app);
      const response = await request
        .get(`${path}/${uuid}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      assertError(response.body);
    });

    it("cannot read todo if unauthenticated", async () => {
      const todoFromDatabase = await todoService.create(user, todoDtoCreate);
      const id = todoFromDatabase.id as string;

      const request = await superoak(app);
      const response = await request
        .get(`${path}/${id}`)
        .expect(403);
      assertError(response.body);
    });

    it("can read todo", async () => {
      const todoFromDatabase = await todoService.create(user, todoDtoCreate);
      const id = todoFromDatabase.id as string;

      const request = await superoak(app);
      const response = await request
        .get(`${path}/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      const todo = assertOk(response.body as Result<TodoDTO>);

      // Verify that object has been read from database.
      assertEquals(todo, databaseObjectToDTO(todoFromDatabase));
    });
  });

  describe("GET todos/", () => {
    it("can read all todos", async () => {
      const request = await superoak(app);
      const response = await request
        .get(path)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      const todos = assertOk(response.body as Result<TodoDTO[]>);
      const todosFromDatabase = await todoRepository.readAll();

      // Verify that objects have been read from database.
      assertEquals(todos, todosFromDatabase.map(databaseObjectToDTO));
    });
  });

  describe("PUT todos/:id", () => {
    it("cannot update todo if it does not exist", async () => {
      const uuid = crypto.randomUUID();

      const request = await superoak(app);
      const response = await request
        .put(`${path}/${uuid}`)
        .set("Authorization", `Bearer ${token}`)
        .send(todoDtoUpdate)
        .expect(404);
      assertError(response.body);
    });

    it(
      "returns error if attempting to update todo with malformed input",
      async () => {
        const todoFromDatabaseBefore = await todoService.create(
          user,
          todoDtoCreate,
        );
        const id = todoFromDatabaseBefore.id as string;

        const request = await superoak(app);
        const response = await request
          .put(`${path}/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(todoDtoUpdateMalformed)
          .expect(400);
        assertError(response.body);

        // Verify that object is unaffected in database.
        const todoFromDatabaseAfter = await todoRepository.readOne({ id });
        assertEquals(
          databaseObjectToDTO(todoFromDatabaseAfter),
          databaseObjectToDTO(todoFromDatabaseBefore),
        );
      },
    );

    it("cannot update todo if unauthenticated", async () => {
      const todoFromDatabaseBefore = await todoService.create(
        user,
        todoDtoCreate,
      );
      const id = todoFromDatabaseBefore.id as string;

      const request = await superoak(app);
      const response = await request
        .put(`${path}/${id}`)
        .send(todoDtoUpdate)
        .expect(403);
      assertError(response.body);
    });

    it("can update todo with well-formed input", async () => {
      const todoFromDatabaseBefore = await todoService.create(
        user,
        todoDtoCreate,
      );
      const id = todoFromDatabaseBefore.id as string;

      const request = await superoak(app);
      const response = await request
        .put(`${path}/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(todoDtoUpdate)
        .expect(200);
      const todo = assertOk(response.body as Result<TodoDTO>);
      assertEquals(todo.title, todoDtoUpdate.title);
      assertEquals(todo.isCompleted, todoDtoUpdate.isCompleted);

      // Verify that object has been saved in database.
      const todoFromDatabaseAfter = await todoRepository.readOne({ id });
      // Ignore property 'updatedAt'.
      const { updatedAt: _, ...before } = databaseObjectToDTO(
        todoFromDatabaseBefore,
      );
      const { updatedAt: __, ...after } = databaseObjectToDTO(
        todoFromDatabaseAfter,
      );
      assertEquals({ ...before, ...todoDtoUpdate }, after);
    });
  });

  describe("DELETE todos/:id", () => {
    it("cannot delete todo if it does not exist", async () => {
      const uuid = crypto.randomUUID();

      const request = await superoak(app);
      const response = await request
        .delete(`${path}/${uuid}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      assertError(response.body);
    });

    it("cannot delete todo if unauthenticated", async () => {
      const todoFromDatabase = await todoService.create(user, todoDtoCreate);
      const id = todoFromDatabase.id as string;

      const request = await superoak(app);
      const response = await request
        .delete(`${path}/${id}`)
        .expect(403);

      assertError(response.body);
    });

    it("can delete todo", async () => {
      const todoFromDatabase = await todoService.create(user, todoDtoCreate);
      const id = todoFromDatabase.id as string;

      const request = await superoak(app);
      const response = await request
        .delete(`${path}/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const todo = assertOk(response.body as Result<TodoDTO>);
      assertEquals(todo, databaseObjectToDTO(todoFromDatabase));

      // Verify that object has been delete from database.
      const todoFromDatabaseAfter = await todoRepository.readOne({ id });
      assertEquals(todoFromDatabaseAfter, undefined);
    });
  });
});
