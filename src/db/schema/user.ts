import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "./base";

// 1. enum 타입 먼저 선언
export const userRoleEnum = pgEnum("role", ["admin", "member"]);

export const usersTable = pgTable("member", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum().notNull(),
  ...baseColumns,
});
