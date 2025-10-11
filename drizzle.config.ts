import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema",
  dbCredentials: {
    ...(process.env.STATUS === "DEV"
      ? {
          host: "localhost",
          user: process.env.POSTGRES_USER!,
          port: 5433,
          password: process.env.POSTGRES_PASSWORD!,
          database: process.env.POSTGRES_DB!,
          ssl: false,
        }
      : {
          url: process.env.DATABASE_URL!,
        }),
  },
});
