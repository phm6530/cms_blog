import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

class Database {
  private static instance: ReturnType<typeof drizzle>;

  static getInstance() {
    if (!Database.instance) {
      let connection;

      //
      if (process.env.STATUS === "DEV") {
        connection = postgres({
          host: process.env.POSTGRES_HOST!,
          port: +process.env.POSTGRES_PORT!,
          user: process.env.POSTGRES_USER!,
          password: process.env.POSTGRES_PASSWORD!,
          database: process.env.POSTGRES_DB!,
        });
      } else {
        console.log("PROD server : connection");
        connection = postgres(process.env.DATABASE_URL!, {
          prepare: false,
        });
      }

      Database.instance = drizzle(connection, { schema });
    }

    return Database.instance;
  }
}

export const db = Database.getInstance();
