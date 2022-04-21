import {
  AbstractMigration,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(): Promise<void> {
    await this.client.queryArray(`CREATE TABLE todos
        (
            id uuid NOT NULL,
            title character varying NOT NULL,
            is_completed boolean NOT NULL DEFAULT false,
            created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT id PRIMARY KEY (id)
        )`);
  }

  /** Runs on rollback */
  async down(): Promise<void> {
    await this.client.queryArray(`DROP TABLE todos`);
  }
}
