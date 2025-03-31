import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle", // 마이그렝리ㅕㄴ ㄴ파일
  schema: "./src/db/schema", // ✅ 여기 수정
  dbCredentials: {
    host: "localhost",
    user: process.env.LOCAL_DB_USER!,
    password: process.env.LOCAL_DB_PASSWORD!,
    database: process.env.LOCAL_DB_NAME!,
    port: 7000,
    ssl: false,
  },
});
