import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { baseColumns, userRoleEnum } from "./base";

export const usersTable = pgTable("admin", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum().notNull(),
  ...baseColumns,
});
