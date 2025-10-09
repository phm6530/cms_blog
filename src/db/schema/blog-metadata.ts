import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./admin";
import { blogSubGroup } from "./category";

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "private",
]);

export const blogMetaSchema = pgTable("blog_metadata", {
  post_id: integer("post_id").primaryKey().generatedAlwaysAsIdentity(), //pk
  post_title: text("post_title").notNull(),
  post_description: text("post_description").notNull(),
  created_at: timestamp().notNull().defaultNow(),
  update_at: timestamp().notNull().defaultNow(),
  category_id: integer("category_id"),
  sub_group_id: integer("sub_group_id").references(
    () => blogSubGroup.sub_group_id,
    { onDelete: "restrict", onUpdate: "cascade" }
  ),
  author_id: integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  thumbnail_url: text("thumbnail_url"),
  status: postStatus("status").notNull().default("published"),
  img_key: text("img_key").notNull(),
  like_cnt: integer("like_cnt").default(0),
});
