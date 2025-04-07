import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

//GUEST BOARD
export const guestBoardSchema = pgTable("guest_board", {
  idx: integer().primaryKey().generatedAlwaysAsIdentity(),
  contents: text("contents").notNull(),
  user_icon: text("user_icon").notNull(),
  author_type: text("author_type").notNull(),
  author_id: text("author_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  parent_id: integer("parent_id"),
});
