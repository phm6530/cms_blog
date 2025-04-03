import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { baseColumns } from "./base";

//GUEST BOARD
export const guestBoardSchema = pgTable("guest_board", {
  idx: integer().primaryKey().generatedAlwaysAsIdentity(),
  contents: text("contents").notNull(),
  user_icon: text("user_icon").notNull(),
  author_type: text("author_type").notNull(),
  author_id: text("author_id").notNull(),
  ...baseColumns,
});
