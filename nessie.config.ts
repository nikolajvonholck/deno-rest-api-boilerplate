import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";
import { config } from "./services/config.ts";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = config;

const options = {
  hostname: POSTGRES_HOST,
  port: POSTGRES_PORT,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
};

const client = new ClientPostgreSQL(options);

const nessieConfig: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default nessieConfig;
