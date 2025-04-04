import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./admin";

export const blogMetaSchema = pgTable("blog_metadata", {
  post_id: integer("post_id").primaryKey().generatedAlwaysAsIdentity(), //pk
  post_title: text("post_title").notNull(),
  post_description: text("post_description").notNull(),
  create_at: timestamp().notNull(),
  update_at: timestamp().notNull(),
  author_id: integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  thumbnail_url: text("thumbnail_url"),
  view: boolean("view").default(true),
});
