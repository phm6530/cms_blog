// db/baseColumns.ts
import { pgEnum, timestamp } from "drizzle-orm/pg-core";

// 1. enum 타입 먼저 선언
export const userRoleEnum = pgEnum("role", ["admin", "guest`"]);
export const authorTypeEnum = pgEnum("author_type", ["admin", "guest"]);

export const baseColumns = {
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
};
