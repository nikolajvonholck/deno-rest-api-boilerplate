import { Database, PostgresConnector } from "../deps.ts";
import { config } from "./config.ts";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = config;

const options = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
};

const connection = new PostgresConnector(options);

export const database = new Database(connection);
