// lib/db.ts
import "dotenv/config";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

class Database {
  private static instance: PostgresJsDatabase<typeof schema>;

  static getInstance() {
    if (!Database.instance) {
      const connection = postgres(process.env.DATABASE_URL!, {
        prepare: false,
      });
      Database.instance = drizzle(connection, { schema });
    }
    return Database.instance;
  }
}

export const db = Database.getInstance();
