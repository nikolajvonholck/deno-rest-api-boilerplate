import { todoRouter } from "./routers/todoRouter.ts";
import {
  routeNotFoundHandler,
  uncaughtExceptionHandler,
} from "./routers/utils.ts";
import { Application, oakCors, Router } from "./deps.ts";
import { Todo } from "./models/Todo.ts";
import { todoRepository } from "./repositories/todoRepository.ts";
import { database } from "./services/database.ts";

// Initialize services.
database.link([Todo]);

// Initialize router.
const todos = todoRouter(todoRepository);

// Construct router.
const router = new Router();
router.use("/todos", todos.routes(), todos.allowedMethods());

// Initialize application.
const app = new Application();

// Enable CORS.
app.use(oakCors());

// Configure routes.
app.use(uncaughtExceptionHandler);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeNotFoundHandler);

export { app };
