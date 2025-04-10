import { integer, pgTable, text } from "drizzle-orm/pg-core";

//Main Blog
export const categorySchema = pgTable("category", {
  group_id: integer("group_id").primaryKey().generatedAlwaysAsIdentity(),
  group_name: text("group_name").notNull(),
});

//sub Schema
export const blogSubGroup = pgTable("blog_sub_group", {
  sub_group_id: integer("sub_group_id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  sub_group_name: text("sub_group_name").notNull(),
  group_id: integer("group_id")
    .notNull()
    .references(() => categorySchema.group_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  default_thum: text("default_thum").notNull(),
});
