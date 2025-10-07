import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const isDev = process.env.STATUS === "DEV";

const commonConfig = {
  host: "localhost",
  user: process.env.POSTGRES_USER!,
  port: 5432,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
};

export const dbCredentials = isDev
  ? commonConfig
  : {
      url: process.env.DATABASE_URL!,
    };

export const migrationCredentials = isDev
  ? { ...commonConfig, max: 1 }
  : {
      connectionString: process.env.DATABASE_URL!,
      max: 1,
    };
