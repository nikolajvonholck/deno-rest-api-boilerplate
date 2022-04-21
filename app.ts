import { todoRouter } from "./routers/todoRouter.ts";
import {
  routeNotFoundHandler,
  uncaughtExceptionHandler,
} from "./routers/utils.ts";
import { Application, oakCors, Router } from "./deps.ts";
import { Todo } from "./models/Todo.ts";
import { database } from "./services/database.ts";
import { todoRepository } from "./repositories/todoRepository.ts";
import { userRepository } from "./repositories/userRepository.ts";
import { User } from "./models/User.ts";
import { makeAuthService } from "./services/authService.ts";
import { authRouter } from "./routers/authRouter.ts";
import { makeAuthMiddleware } from "./routers/authMiddleware.ts";

// Initialize services.
database.link([Todo, User]);
const authService = makeAuthService(userRepository);

// Initialize middlewares.
const authMiddleware = makeAuthMiddleware(authService);

// Initialize routers.
const auth = authRouter(authService);
const todos = todoRouter(todoRepository);

// Construct router.
const router = new Router();
router.use("/auth", auth.routes(), auth.allowedMethods());
router.use("/todos", todos.routes(), todos.allowedMethods());

// Initialize application.
const app = new Application();

// Enable CORS.
app.use(oakCors());

// Configure routes.
app.use(uncaughtExceptionHandler);
app.use(authMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeNotFoundHandler);

export { app };
