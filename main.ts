import { app, configService } from "./app.ts";

const { PORT } = configService.config;

console.info(`Listening on port: ${PORT}..`);

await app.listen({ port: PORT });
