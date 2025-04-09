import { pgTable, integer, timestamp, text } from "drizzle-orm/pg-core";

export const visitorSchema = pgTable("visitor", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  visited_at: timestamp("visited_at", { mode: "date" }).defaultNow().notNull(),
  visitor_agent: text().notNull(),
  ip: text(),
  where: text(),
});
