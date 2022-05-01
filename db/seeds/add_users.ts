import {
  AbstractSeed,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";
import { hash } from "../../utils/hashing.ts";

export default class extends AbstractSeed<ClientPostgreSQL> {
  /** Runs on seed */
  async run(): Promise<void> {
    // Hardcoded initial user.
    const id = "b8d2d2d5-a742-41a5-b5f9-e2349420b797";
    const email = "mail@example.com";
    const password = "password";
    const hashedPassword = await hash(password);
    await this.client.queryArray(`
      INSERT INTO users (id, email, password_hash)
      VALUES ('${id}','${email}','${hashedPassword}')
      ON CONFLICT DO NOTHING;
    `);
  }
}
