import { app } from "./app.ts";
import { config } from "./services/config.ts";

const { PORT } = config;

console.info(`Listening on port: ${PORT}..`);

await app.listen({ port: PORT });
