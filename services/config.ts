import { z } from "../deps.ts";

const ConfigSchema = z.object({
  PORT: z.preprocess(Number, z.number()),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.preprocess(Number, z.number()),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  TOKEN_SECRET: z.string(),
  TOKEN_EXPIRATION_SECONDS: z.preprocess(Number, z.number()),
});

export type Config = z.infer<typeof ConfigSchema>;

const env = Deno.env.toObject();

export const config = ConfigSchema.parse(env);
