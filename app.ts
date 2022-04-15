import { TodoRouter } from "./controllers/TodoController.ts";
import {
  routeNotFoundHandler,
  uncaughtExceptionHandler,
} from "./controllers/utils.ts";
import { Application, Router } from "./deps.ts";
import { Todo } from "./models/Todo.ts";
import { TodoRepo } from "./repositories/TodoRepo.ts";
import { database } from "./services/DatabaseService.ts";

// Initialize services.
database.link([Todo]);

// Initialize router.
const todoRouter = TodoRouter(TodoRepo);

// Construct router.
const router = new Router();
router.use("/todos", todoRouter.routes(), todoRouter.allowedMethods());

// Initialize application.
const app = new Application();

app.use(uncaughtExceptionHandler);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeNotFoundHandler);

export { app };
