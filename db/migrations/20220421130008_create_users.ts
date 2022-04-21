import {
  AbstractMigration,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(): Promise<void> {
    await this.client.queryArray(`CREATE TABLE users
        (
            id uuid NOT NULL,
            email character varying NOT NULL,
            password_hash character varying NOT NULL,
            created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT users_id PRIMARY KEY (id)
        )`);
  }

  /** Runs on rollback */
  async down(): Promise<void> {
    await this.client.queryArray(`DROP TABLE users`);
  }
}
