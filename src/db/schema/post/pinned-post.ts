import { boolean, integer, pgTable } from "drizzle-orm/pg-core";
import { baseSchema } from "../base";
import { blogMetaSchema } from "../blog-metadata";

export const pinnedPostSchema = pgTable("pinned_post", {
  ...baseSchema,
  post_id: integer()
    .notNull()
    .references(() => blogMetaSchema.post_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  active: boolean(),
  order: integer(),
});
