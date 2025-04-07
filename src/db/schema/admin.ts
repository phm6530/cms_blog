import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./base";

export const usersTable = pgTable("admin", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  admin_name: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull(),
  profile_img: text("profile_img"),
});
