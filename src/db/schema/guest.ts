import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const guestSchema = pgTable("guest", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nickname: text("nickname").notNull().unique(),
  password: text("password").notNull().unique(),
  guest_icon: text("guest_icon"),
});
