import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { blogMetaSchema } from "./blog-metadata";

export const blogContentsSchema = pgTable("blog_contents", {
  content_id: integer("content_id").primaryKey().generatedAlwaysAsIdentity(), //pk
  post_id: text("post_id")
    .notNull()
    .references(() => blogMetaSchema.post_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  contents: text("contents").notNull(),
  contents_key: text("contents_key").notNull(),
});
