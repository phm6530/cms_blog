import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

// NEXT_PUBLIC_ 은 클라이언트에 노출되므로 제거하는 것이 좋습니다
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
