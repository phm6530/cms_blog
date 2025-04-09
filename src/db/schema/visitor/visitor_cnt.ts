import { integer, pgTable } from "drizzle-orm/pg-core";

export const visitor_cnt = pgTable("visitor_cnt", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  visitor_cnt: integer(),
});
