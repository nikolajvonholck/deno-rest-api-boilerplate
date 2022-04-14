import { TodoController } from "./controllers/TodoController.ts";
import {
  routeNotFoundHandler,
  uncaughtExceptionHandler,
} from "./controllers/utils.ts";
import { Application, Router } from "./deps.ts";
import { TodoRepo } from "./repositories/TodoRepo.ts";
import { ConfigService } from "./services/ConfigService.ts";
import { DatabaseService } from "./services/DatabaseService.ts";

// Initialize services.
const configService = new ConfigService();
const databaseService = new DatabaseService(configService);
const todoRepo = new TodoRepo(databaseService);
console.info("todoRepo", todoRepo);

// Initialize controllers.
const todoController = new TodoController(todoRepo);
console.info("todoController", todoController);

const todoRouter = todoController.getRouter();
console.info("todoRouter", todoRouter);

// Construct router.
const router = new Router();
router.use("/todos", todoRouter.routes(), todoRouter.allowedMethods());

// Initialize application.
const app = new Application();

app.use(uncaughtExceptionHandler);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeNotFoundHandler);

export { app, configService };
