import { z } from "../deps.ts";

const ConfigSchema = z.object({
  PORT: z.preprocess(Number, z.number()),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.preprocess(Number, z.number()),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

type Config = z.infer<typeof ConfigSchema>;

export interface IConfigService {
  config: Config;
}

export class ConfigService implements IConfigService {
  readonly config: Config;

  constructor() {
    const env = Deno.env.toObject();
    this.config = ConfigSchema.parse(env);
  }
}
