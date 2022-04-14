import { Database, PostgresConnector } from "../deps.ts";
import { IConfigService } from "./ConfigService.ts";

export interface IDatabaseService {
  database: Database;
}

export class DatabaseService implements IDatabaseService {
  readonly database: Database;

  constructor(configService: IConfigService) {
    const {
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
    } = configService.config;
    const options = {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
    };
    const connection = new PostgresConnector(options);
    this.database = new Database(connection);
  }
}
