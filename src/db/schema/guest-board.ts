import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";
import { authorTypeEnum } from "./base";

//GUEST BOARD
export const guestBoardSchema = pgTable("guest_board", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  comment: text("comment").notNull(),
  author_type: authorTypeEnum("author_type").notNull(),
  author_id: text("author_id").notNull(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  parent_id: integer("parent_id"),
});
