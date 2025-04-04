import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { authorTypeEnum, baseColumns } from "./base";
import { blogMetaSchema } from "./blog-metadata";

export const commentSchema = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  comment: text("comment").notNull(),
  parent_id: integer("parent_id"),
  author_id: integer("author_id").notNull(),
  author_type: authorTypeEnum("author_type").notNull(),
  post_id: integer("post_id")
    .notNull()
    .references(() => blogMetaSchema.post_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  ...baseColumns,
});
